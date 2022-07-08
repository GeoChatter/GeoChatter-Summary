declare module ScoreBoard {

    export interface Player {
        id: number;
        channel: string;
        twitchId: string;
        playerName: string;
        playerFlag: string;
        playerFlagName: string;
        countryStreak: number;
        bestStreak: number;
        correctCountries: number;
        numberOfCountries: number;
        wins: number;
        perfects: number;
        overallAverage: number;
        bestGame: number;
        bestRound: number;
        sumOfGuesses: number;
        totalDistance: number;
        lastGuess: string;
        noOfGuesses: number;
        noOf5kGuesses: number;
        roundNumberOfLastGuess: number;
        displayName: string;
        profilePictureUrl: string;
        color?: any;
        isBanned: boolean;
        streakBefore: number;
        firstGuessMade: boolean;
        idOfLastGame: number;
        modified: Date;
    }

    export interface Row {
        id: number;
        guessCount: number;
        player: Player;
        distance: number;
        score: number;
        time: number;
    }

}