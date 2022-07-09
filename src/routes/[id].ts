
// import * as signalR from '@microsoft/signalr';
export async function get({ params }: { params: { id: string } }) {
    // `params.id` comes from [id].js

    // const connection = new signalR.HubConnectionBuilder()
    //     .withUrl('https://dev.geochatter.tv/guess/geoChatterHub')
    //     .build();
    // const startRes = connection.start();
    // const getGameSummary = async (gameId: string) => {
    //     await startRes;
    //     const res: ScoreBoard.Row[] = await connection.invoke('GetGameSummary', gameId);

    //     console.log(res);
    //     return res;
    // };
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