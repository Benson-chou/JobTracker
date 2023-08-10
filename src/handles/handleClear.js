import { collection, where, getDocs, query, deleteDoc} from "@firebase/firestore"
import { db } from "../firebase_setup/firebase"

const handleClear = async (id) => {
    // var jobs_query = db.collection("jobDescrip").where("link", "==", url)
    const jobs = collection(db, "jobDescrip")
    const q = query(jobs, where("id", "==", id))
    try {
        const querySnapshot = await getDocs(q);
            querySnapshot.forEach((doc) => {
                deleteDoc(doc.ref)
            })
        // jobs.where("link", "==", url).get()
        //     .then((querySnapshot) => {
        //         querySnapshot.forEach((doc) => {
        //             doc.ref.delete()
        //         })
        //     })
    } catch(err) {
        console.log(err)
    }
}
 
export default handleClear