import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  serverTimestamp,
  updateDoc,
} from 'firebase/firestore'
import { db } from './firebase'

const getApplicationsCollection = (userId) => {
  return collection(db, 'users', userId, 'applications')
}

export const addApplication = async (userId, data) => {
  const applicationsCollection = getApplicationsCollection(userId)

  const applicationData = {
    company: data.company ?? '',
    role: data.role ?? '',
    status: data.status ?? 'Applied',
    appliedDate: data.appliedDate ?? '',
    jobUrl: data.jobUrl ?? '',
    notes: data.notes ?? '',
    createdAt: serverTimestamp(),
  }

  const docRef = await addDoc(applicationsCollection, applicationData)
  return docRef.id
}

export const getApplications = async (userId) => {
  const applicationsCollection = getApplicationsCollection(userId)
  const querySnapshot = await getDocs(applicationsCollection)

  return querySnapshot.docs.map((applicationDoc) => ({
    id: applicationDoc.id,
    ...applicationDoc.data(),
  }))
}

export const updateApplication = async (userId, id, data) => {
  const applicationDocRef = doc(db, 'users', userId, 'applications', id)
  await updateDoc(applicationDocRef, data)
}

export const deleteApplication = async (userId, id) => {
  const applicationDocRef = doc(db, 'users', userId, 'applications', id)
  await deleteDoc(applicationDocRef)
}
