export default function handleFirebaseError(error) {
    if (!error.message) location.reload()
    throw new Error(
        error.message || 'An unexpected error occurred. Please try again'
    )
}
