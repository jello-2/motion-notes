import firebase_admin
from firebase_admin import credentials, firestore

# Load the service account key JSON file
cred = credentials.Certificate("C:/Users/Daniel/Downloads/yvrnotes-77c78-firebase-adminsdk-rozle-cc756e69ba.json")
firebase_admin.initialize_app(cred)

# Initialize Firestore client
db = firestore.client()

def delete_documents_in_collection(collection_ref, batch_size=500):
    docs = collection_ref.limit(batch_size).stream()
    deleted = 0

    for doc in docs:
        print(f"Deleting document: {doc.id} from collection {collection_ref.id}")
        doc.reference.delete()
        deleted += 1

    if deleted >= batch_size:
        return delete_documents_in_collection(collection_ref, batch_size)

def delete_4_letter_collections():
    collections = db.collections()

    for collection in collections:
        # Delete collections with 4-letter IDs
        if len(collection.id) == 4:
            print(f"Deleting collection: {collection.id}")
            delete_documents_in_collection(collection)

    print("All 4-letter collections have been deleted.")

def delete_4_letter_documents_in_rooms():
    rooms_collection = db.collection("rooms")
    docs = rooms_collection.stream()

    for doc in docs:
        # Delete documents with 4-letter IDs in the "rooms" collection
        if len(doc.id) == 4:
            print(f"Deleting document: {doc.id} from collection 'rooms'")
            doc.reference.delete()

    print("All 4-letter documents in the 'rooms' collection have been deleted.")

if __name__ == "__main__":
    # Delete all 4-letter collections in root
    delete_4_letter_collections()

    # Delete all 4-letter documents inside the "rooms" collection
    delete_4_letter_documents_in_rooms()
    