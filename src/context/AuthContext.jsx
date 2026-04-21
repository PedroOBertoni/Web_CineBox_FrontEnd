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
import { auth } from "../firebase";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Escuta mudanças de estado de autenticação do Firebase
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        setUser({
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          name: firebaseUser.displayName || firebaseUser.email.split("@")[0],
        });
      } else {
        setUser(null);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const register = async (email, password, name) => {
    try {
      const credential = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(credential.user, { displayName: name });
      setUser({ uid: credential.user.uid, email, name });
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

  const loginWithGoogle = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const credential = await signInWithPopup(auth, provider);
      const u = credential.user;
      setUser({ uid: u.uid, email: u.email, name: u.displayName || u.email.split("@")[0] });
      return { ok: true };
    } catch (err) {
      if (err.code === "auth/popup-closed-by-user") return { ok: false, error: null };
      return { ok: false, error: firebaseError(err.code) };
    }
  };

  // Abre popup do Google apenas para obter nome e email — não loga ainda
  const getGoogleProfile = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const credential = await signInWithPopup(auth, provider);
      const u = credential.user;
      // Desloga imediatamente — o cadastro ainda não foi finalizado
      await signOut(auth);
      return { ok: true, name: u.displayName || "", email: u.email, uid: u.uid };
    } catch (err) {
      if (err.code === "auth/popup-closed-by-user") return { ok: false, error: null };
      return { ok: false, error: firebaseError(err.code) };
    }
  };

  const logout = () => signOut(auth);

  return (
    <AuthContext.Provider value={{ user, loading, login, register, loginWithGoogle, getGoogleProfile, logout }}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

// Traduz os códigos de erro do Firebase para português
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
