import User from "../models/user"
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { ref, set, getDatabase } from "firebase/database"
import { auth, db, app } from "../core/firebase"
import {shad1} from "../core/common"


export const saveUserData = async ( user_id, email, user_name ) =>
{
    let response = {};
    response = await User._add( user_id, { email, user_name, id_user: user_id, user_publick_token: shad1(user_id) } );
    return response;
}

export const SigninWithEandP = async ( { email, password } ) =>
{
    let response = {}
    await signInWithEmailAndPassword( auth, email, password )
        .then( ( result ) =>
        {
            response = { state: true, message: "success", data: result }
        } )
        .catch( ( error ) =>
        {
            if ( error.code == "auth/user-not-found" )
            {
                response = { state: false, message: "User not found" }
            }
            else if ( error.code == "auth/wrong-password" )
            {
                response = { state: false, message: "Wrong password" }
            }
            else if ( error.code == "auth/user-disabled" )
            {
                response = { state: false, message: "User disabled" }
            }
            else if ( error.code == "auth/too-many-requests" )
            {
                response = { state: false, message: "Too many requests" }
            }
            else response = { state: false, message: "Can't authenticate" }
        } );
    return response;
}

export const SignupWithEandP = async ( { email, password, user_name } ) =>
{
    let response = {};
    await createUserWithEmailAndPassword( auth, email, password )
        .then( async ( userCredential ) =>
        {
            const saveResult = await saveUserData( userCredential.user.uid, email, user_name );
            response = { ...saveResult, uid: userCredential.user.uid };
        } )
        .catch( ( error ) =>
        {
            if ( error.code == "auth/email-already-in-use" )
            {
                response = { state: false, message: "Email already in use." };
            }
        } );
    return response;
}
