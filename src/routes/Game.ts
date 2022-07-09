export interface Game {
    previous: any
    next: any
    id: number
    channel: string
    start: string
    end: string
    geoGuessrId: string
    isUsStreak: boolean
    bounds: Bounds
    flags: number
    mode: number
    currentRound: number
    positionInChainFromStart: number
    players: Player[]
    rounds: Round[]
    results: Result[]
    source: Source
}

export interface Bounds {
    id: number
    min: any
    max: any
}

export interface Player {
    id: number
    channel: string
    twitchId: string
    playerName: string
    playerFlag: any
    playerFlagName: string
    countryStreak: number
    bestStreak: number
    correctCountries: number
    numberOfCountries: number
    wins: number
    perfects: number
    overallAverage: number
    bestGame: number
    bestRound: number
    sumOfGuesses: number
    totalDistance: number
    lastGuess: string
    noOfGuesses: number
    noOf5kGuesses: number
    roundNumberOfLastGuess: number
    displayName: string
    profilePictureUrl: string
    color?: string
    isBanned: boolean
    streakBefore: number
    firstGuessMade: boolean
    idOfLastGame: number
    modified: string
}

export interface Round {
    id: number
    correctLocation: any
    roundNumber: number
    flags: number
    guesses: any[]
    results: any[]
    country: any
    exactCountry: any
    timeStamp: string
}

export interface Result {
    id: number
    guessCount: number
    player?: Player
    distance: number
    score: number
    streak: number
    time: number
}



export interface Source {
    id: number
    token: string
    type: string
    mode: string
    state: string
    roundCount: number
    timeLimit: number
    forbidMoving: boolean
    forbidZooming: boolean
    forbidRotating: boolean
    streakType: string
    map: string
    mapName: string
    panoramaProvider: number
    bounds: any
    round: number
    rounds: any
    player: any
}
