import { collection, where, getDocs, query, deleteDoc} from "@firebase/firestore"
import { db } from "../firebase_setup/firebase"

const handleClear = async (email, url) => {
    // var jobs_query = db.collection("jobDescrip").where("link", "==", url)
    const requests = collection(db, "requests")
    const q3 = query(requests, where("UserID", "==", email), 
                                 where("JobID", "==", url))
    try {
        const querySnapshot = await getDocs(q3);
            querySnapshot.forEach((doc) => {
                deleteDoc(doc.ref)
            })

    } catch(err) {
        console.log(err)
    }
}
 
export default handleClear