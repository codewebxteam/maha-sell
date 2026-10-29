"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";

const AuthContext = createContext({});

export const useAuth = () => useContext(AuthContext);

export const isEmailAdmin = (email = "") => {
  const clean = (email || "").toLowerCase().trim();
  return (
    clean === "info@mahasell.in" ||
    clean === "admin@mahasell.in" ||
    clean === "mahasell@gmail.com" ||
    clean === "mahasell360@gmail.com" ||
    clean === "admin@mahasell.com" ||
    clean.startsWith("admin@")
  );
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [partnerStatus, setPartnerStatus] = useState(null);
  const [shopName, setShopName] = useState("");
  const [partnerData, setPartnerData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setLoading(true);
      if (firebaseUser) {
        setUser(firebaseUser);
        
        let determinedRole = "customer";
        let determinedPartnerStatus = null;
        let determinedShopName = "";
        let profileData = null;

        try {
          // Fetch user role from Firestore
          const userDocRef = doc(db, "users", firebaseUser.uid);
          const userDoc = await getDoc(userDocRef);
          
          if (userDoc.exists()) {
            profileData = userDoc.data();
            determinedRole = (profileData.role || "customer").toLowerCase();
            if (determinedRole === "partner") {
              determinedPartnerStatus = (profileData.partnerStatus || "pending").toLowerCase();
              determinedShopName = profileData.shopName || "";
            }
          }
        } catch (error) {
          console.warn("Notice: reading user role from Firestore:", error);
        }

        // Automatic Admin detection via designated admin emails, specific UID or Firestore role
        const isUserAdmin = 
          determinedRole === "admin" || 
          isEmailAdmin(firebaseUser.email) ||
          firebaseUser.uid === "DQDS3xO8UeZj0SymUiYkgnfrf4s2" ||
          firebaseUser.uid === "iwFl7PRB7RXwnnoz0tMbYKZAzC";

        if (isUserAdmin) {
          determinedRole = "admin";
          // Sync to Firestore in background
          try {
            await setDoc(doc(db, "users", firebaseUser.uid), {
              email: firebaseUser.email,
              role: "admin",
              updatedAt: new Date().toISOString()
            }, { merge: true });
          } catch (_) {}
        }

        setRole(determinedRole);
        setPartnerStatus(determinedPartnerStatus);
        setShopName(determinedShopName);
        setPartnerData(profileData);
      } else {
        setUser(null);
        setRole(null);
        setPartnerStatus(null);
        setShopName("");
        setPartnerData(null);
      }
      
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const isAdmin = role === "admin" || (user && isEmailAdmin(user.email));
  const isPartner = role === "partner";
  const isPartnerApproved = isPartner && partnerStatus === "approved";

  return (
    <AuthContext.Provider value={{ 
      user, 
      role, 
      partnerStatus, 
      shopName, 
      partnerData, 
      isAdmin, 
      isPartner, 
      isPartnerApproved, 
      loading 
    }}>
      {children}
    </AuthContext.Provider>
  );
};
