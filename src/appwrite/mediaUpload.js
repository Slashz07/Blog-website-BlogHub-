import { Client,Databases,Storage, ID } from "appwrite";
import configEnvVar from "../configure/config";

class mediaUpload{
    client=new Client()
    databases
    bucket

    constructor(){
        this.client
        .setEndpoint(configEnvVar.appwriteUrl)
        .setProject(configEnvVar. appwriteProjectId)
        this.databases=new Databases(this.client)
        this.bucket=new Storage(this.client)
    }

    async uploadFile(file){
        // eslint-disable-next-line no-useless-catch
        try {
            return await this.bucket.createFile(
                configEnvVar.bucketId,
                ID.unique(),
                file
            )
        } catch (error) {
            throw error
        }
    }

    async deleteFile(fileId){
        try {
            return await this.bucket.deleteFile(
                configEnvVar.bucketId,
                fileId
            )
        } catch (error) {
            console.log("could not delete the file")
            return false
        }
    }
    getFilePreview(fileId){
        // eslint-disable-next-line no-useless-catch
        try {
            return this.bucket.getFileView(
                configEnvVar.bucketId,
                fileId
            ).href
        } catch (error) {
            throw error
        }
      
    }

}

const uploadFiles=new mediaUpload()
export default uploadFiles 