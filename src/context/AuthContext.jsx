import { createContext, useState, useEffect } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
  browserSessionPersistence,
  browserLocalPersistence,
  setPersistence,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import { doc, setDoc, getDoc, serverTimestamp } from "firebase/firestore";
import { auth, db } from "../firebase";

export const AuthContext = createContext();

// Salva ou atualiza dados do usuário no Firestore
const saveUserDoc = async (uid, data) => {
  await setDoc(doc(db, "users", uid), data, { merge: true });
};

// Busca dados do usuário no Firestore
const getUserDoc = async (uid) => {
  const snap = await getDoc(doc(db, "users", uid));
  return snap.exists() ? snap.data() : null;
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const data = await getUserDoc(firebaseUser.uid);
        setUser({
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          name: firebaseUser.displayName || firebaseUser.email.split("@")[0],
          plan: data?.plan || null,
        });
      } else {
        setUser(null);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const register = async (email, password, name, plan) => {
    try {
      const credential = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(credential.user, { displayName: name });
      await saveUserDoc(credential.user.uid, {
        name,
        email,
        plan,
        createdAt: serverTimestamp(),
      });
      setUser({ uid: credential.user.uid, email, name, plan });
      return { ok: true };
    } catch (err) {
      return { ok: false, error: firebaseError(err.code) };
    }
  };

  const login = async (email, password, remember = false) => {
    try {
      await setPersistence(auth, remember ? browserLocalPersistence : browserSessionPersistence);
      await signInWithEmailAndPassword(auth, email, password);
      return { ok: true };
    } catch (err) {
      return { ok: false, error: firebaseError(err.code) };
    }
  };

  const loginWithGoogle = async (plan = null) => {
    try {
      const provider = new GoogleAuthProvider();
      const credential = await signInWithPopup(auth, provider);
      const u = credential.user;
      // Se vier com plano (fluxo de cadastro), salva no Firestore
      if (plan) {
        await saveUserDoc(u.uid, {
          name: u.displayName || u.email.split("@")[0],
          email: u.email,
          plan,
          createdAt: serverTimestamp(),
        });
      }
      const data = await getUserDoc(u.uid);
      setUser({
        uid: u.uid,
        email: u.email,
        name: u.displayName || u.email.split("@")[0],
        plan: data?.plan || plan || null,
      });
      return { ok: true };
    } catch (err) {
      if (err.code === "auth/popup-closed-by-user") return { ok: false, error: null };
      return { ok: false, error: firebaseError(err.code) };
    }
  };

  const getGoogleProfile = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const credential = await signInWithPopup(auth, provider);
      const u = credential.user;
      await signOut(auth);
      return { ok: true, name: u.displayName || "", email: u.email, uid: u.uid };
    } catch (err) {
      if (err.code === "auth/popup-closed-by-user") return { ok: false, error: null };
      return { ok: false, error: firebaseError(err.code) };
    }
  };

  const updatePlan = async (plan) => {
    try {
      await saveUserDoc(auth.currentUser.uid, { plan });
      setUser((u) => ({ ...u, plan }));
      return { ok: true };
    } catch (err) {
      return { ok: false, error: "Erro ao atualizar plano. Tente novamente." };
    }
  };

  const logout = () => signOut(auth);

  return (
    <AuthContext.Provider value={{ user, loading, login, register, loginWithGoogle, getGoogleProfile, updatePlan, logout }}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

function firebaseError(code) {
  const errors = {
    "auth/email-already-in-use": "Este e-mail já está cadastrado.",
    "auth/invalid-email": "E-mail inválido.",
    "auth/weak-password": "A senha deve ter pelo menos 6 caracteres.",
    "auth/user-not-found": "E-mail ou senha incorretos.",
    "auth/wrong-password": "E-mail ou senha incorretos.",
    "auth/invalid-credential": "E-mail ou senha incorretos.",
    "auth/too-many-requests": "Muitas tentativas. Tente novamente mais tarde.",
    "auth/network-request-failed": "Erro de conexão. Verifique sua internet.",
  };
  return errors[code] || "Ocorreu um erro. Tente novamente.";
}
