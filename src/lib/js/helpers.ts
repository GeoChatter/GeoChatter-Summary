import type { Response } from "src/types/Game";
export function getPlayerNameFromPlayer(player: Response.Player) {
    return player.playerName.toLowerCase() === player.displayName.toLocaleLowerCase()
        ? player.playerName
        : player?.displayName;
}
export function processGGPanoId2GooglePanoId(pano: string): string {
		console.log(pano);
		const len = pano.length / 2;
		let realPano = '';

		for (let i = 0; i < len; i++) {
			realPano += String.fromCharCode(parseInt(pano.substr(i * 2, 2), 16));
		}
		console.log(realPano);
		return realPano;
	}

