"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"
import {
  type User,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  signInWithPopup,
  updateProfile,
} from "firebase/auth"
import { doc, setDoc, getDoc } from "firebase/firestore"
import { auth, googleProvider, microsoftProvider, db } from "../lib/firebase"

interface AuthUser extends User {
  displayName: string | null
  email: string | null
}

// ✅ Updated Student schema
export interface UserData {
  uid: string
  id?: string
  name?: string
  email: string | null
  phone?: string
  dob?: string
  location?: string
  currentEducation?: {
    gradeLevel?: string
    schoolName?: string
    board?: string
    percentage?: number | null
    subjects?: string[]
    expectedGraduationYear?: number | null
  }
  testScores?: {
    testName: string
    score: number | null
    rank?: string
  }[]
  createdAt?: Date
}

interface AuthContextType {
  user: AuthUser | null
  userData: UserData | null
  loading: boolean
  signUp: (email: string, password: string, displayName: string) => Promise<void>
  signIn: (email: string, password: string) => Promise<void>
  signInWithGoogle: () => Promise<void>
  signInWithMicrosoft: () => Promise<void>
  logout: () => Promise<void>
  updateUserData: (data: Partial<UserData>) => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error("useAuth must be used within an AuthProvider")
  return context
}

interface AuthProviderProps {
  children: ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [userData, setUserData] = useState<UserData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser as AuthUser)
        await fetchUserData(firebaseUser.uid)
      } else {
        setUser(null)
        setUserData(null)
      }
      setLoading(false)
    })
    return unsubscribe
  }, [])

  const fetchUserData = async (uid: string) => {
    try {
      const userDoc = await getDoc(doc(db, "users", uid))
      if (userDoc.exists()) setUserData(userDoc.data() as UserData)
    } catch (error) {
      console.error("Error fetching user data:", error)
    }
  }

  const signUp = async (email: string, password: string, displayName: string) => {
    const { user: firebaseUser } = await createUserWithEmailAndPassword(auth, email, password)
    await updateProfile(firebaseUser, { displayName })
    const newUserData: UserData = {
      uid: firebaseUser.uid,
      id: "stu_" + Date.now(),
      name: displayName,
      email: firebaseUser.email,
      createdAt: new Date(),
    }
    await setDoc(doc(db, "users", firebaseUser.uid), newUserData)
    setUserData(newUserData)
  }

  const signIn = async (email: string, password: string) => {
    await signInWithEmailAndPassword(auth, email, password)
  }

  const signInWithGoogle = async () => {
    const { user: firebaseUser } = await signInWithPopup(auth, googleProvider)
    const userDoc = await getDoc(doc(db, "users", firebaseUser.uid))
    if (!userDoc.exists()) {
      const newUserData: UserData = {
        uid: firebaseUser.uid,
        id: "stu_" + Date.now(),
        name: firebaseUser.displayName ?? undefined,
        email: firebaseUser.email,
        createdAt: new Date(),
      }
      await setDoc(doc(db, "users", firebaseUser.uid), newUserData)
      setUserData(newUserData)
    }
  }

  const signInWithMicrosoft = async () => {
    const { user: firebaseUser } = await signInWithPopup(auth, microsoftProvider)
    const userDoc = await getDoc(doc(db, "users", firebaseUser.uid))
    if (!userDoc.exists()) {
      const newUserData: UserData = {
        uid: firebaseUser.uid,
        id: "stu_" + Date.now(),
        name: firebaseUser.displayName ?? undefined,
        email: firebaseUser.email,
        createdAt: new Date(),
      }
      await setDoc(doc(db, "users", firebaseUser.uid), newUserData)
      setUserData(newUserData)
    }
  }

  const logout = async () => await signOut(auth)

  const updateUserData = async (data: Partial<UserData>) => {
    if (!user) return
    const updatedData = { ...userData, ...data }
    await setDoc(doc(db, "users", user.uid), updatedData, { merge: true })
    setUserData(updatedData as UserData)
  }

  const value: AuthContextType = {
    user,
    userData,
    loading,
    signUp,
    signIn,
    signInWithGoogle,
    signInWithMicrosoft,
    logout,
    updateUserData,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
