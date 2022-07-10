export declare module Response {

    export interface Bounds {
        id: number;
        min?: any;
        max?: any;
    }

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
        color: string;
        isBanned: boolean;
        streakBefore: number;
        firstGuessMade: boolean;
        idOfLastGame: number;
        modified: Date;
    }

    export interface CorrectLocation {
        id: number;
        latitude: number;
        longitude: number;
    }

    export interface GuessLocation {
        id: number;
        latitude: number;
        longitude: number;
    }


    export interface Country {
        id: number;
        code: string;
        name: string;
    }

    export interface CountryExact {
        id: number;
        code: string;
        name: string;
    }

    export interface Guess {
        id: number;
        time: number;
        guessLocation: GuessLocation;
        distance: number;
        guessedBefore: boolean;
        isStreamerGuess: boolean;
        wasRandom: boolean;
        isTemporary: boolean;
        score: number;
        streak: number;
        pano: string | null;
        player: Player;
        timeStamp: Date;
        country: Country;
        countryExact: CountryExact;
        guessCounter: number;
        state: number;
        bot?: any;
    }


    export interface Result {
        id: number;
        player: Player;
        distance: number;
        score: number;
        time: number;
        streak: number;
    }

    export interface Round {
        id: number;
        correctLocation: CorrectLocation;
        roundNumber: number;
        flags: number;
        guesses: Guess[];
        results: Result[];
        country?: any;
        exactCountry?: any;
        timeStamp: Date;
    }


    export interface RoundLocation {
        id: number;
        lat: number;
        lng: number;
        panoId: string | undefined;
        heading: number;
        pitch: number;
        zoom: number;
        streakLocationCode: string;
    }

    export interface Source {
        id: number;
        token: string;
        type: string;
        mode: string;
        state: string;
        roundCount: number;
        timeLimit: number;
        forbidMoving: boolean;
        forbidZooming: boolean;
        forbidRotating: boolean;
        streakType: string;
        map: string;
        mapName: string;
        panoramaProvider: number;
        bounds?: any;
        round: number;
        rounds: RoundLocation[];
        player?: any;
    }

    export interface Game {
        next?: any;
        id: number;
        channel: string;
        start: Date;
        end: Date;
        geoGuessrId: string;
        isUsStreak: boolean;
        bounds: Bounds;
        flags: number;
        mode: number;
        currentRound: number;
        positionInChainFromStart: number;
        players: Player[];
        rounds: Round[];
        results: Result[];
        source: Source;
    }

}

