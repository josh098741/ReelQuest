import {Client, Databases, ID, Query} from "appwrite"
// Track the searches that are made by the user


const DATABASE_ID = process.env.EXPO_PUBLIC_APPWRITE_DATABASE_ID!
const COLLLECTION_ID = process.env.EXPO_PUBLIC_APPWRITE_COLLECTION_ID!

const client = new Client()
    .setEndpoint('https://cloud.appwrite.io/v1')
    .setProject(process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID!)

const database = new Databases(client);


export const updateSearchCount = async (query: string, movie: Movie) => {
    try{
        const result = await database.listDocuments(DATABASE_ID, COLLLECTION_ID, [
            Query.equal('searchTerm', query)
        ])

        // check if a record of that search has already been stored
        if(result.documents.length > 0){
            const existingMovie = result.documents[0]

            await database.updateDocument(
                DATABASE_ID,
                COLLLECTION_ID,
                existingMovie.$id,
                {
                    count: existingMovie.count + 1
                }
            )
        }else{
            await database.createDocument(DATABASE_ID, COLLLECTION_ID, ID.unique(), {
                searchTerm: query,
                movie_id: movie.id,
                count: 1,
                title: movie.title,
                poster_url: `https://image.tmdb.org/t/p/w500/${movie.poster_path}`
            })
        }

    }catch(error){
        console.log(error);
        throw error
    }
    
    
    // if a document is found increment the search count field
    // if no document is found create a new document in appwrite and update its search count to one
}