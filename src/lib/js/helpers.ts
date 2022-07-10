import type { Response } from "src/types/Game";
export function getPlayerNameFromPlayer(player: Response.Player) {
    return player.playerName.toLowerCase() === player.displayName.toLocaleLowerCase()
        ? player.playerName
        : player?.displayName;
}