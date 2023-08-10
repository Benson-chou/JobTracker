import { addDoc, collection } from "@firebase/firestore"
import { db } from "../firebase_setup/firebase"
 
const handleSave = (id, url, name) => {
    const ref = collection(db, "jobDescrip") // Firebase creates this automatically
 
    let data = {
        id: id,
        link: url, 
        name: name,
        description: false
    }
    
    try {
        addDoc(ref, data)
    } catch(err) {
        console.log(err)
    }
}
 
export default handleSave