
export async function get({ params }: { params: { id: string } }) {
    // `params.id` comes from [id].js

    if (params.id) {
        return {
            status: 200,
            headers: {},
            body: { id: params.id }
        };
    }

    return {
        status: 404
    };
}