import { gameCharacters } from "./enums/enums"

export default {
    [gameCharacters.steven]: {
        [gameCharacters.peridot]: {
            before: {
                start: 'opponent',
                lines: 3
            },
            after: {
                start: 'opponent',
                lines: 2
            }
        },
        [gameCharacters.jasper]: {
            before: {
                start: 'opponent',
                lines: 2
            },
            after: {
                start: 'opponent',
                lines: 2
            }
        },
        [gameCharacters.y_diamond]: {
            before: {
                start: 'player',
                lines: 4
            },
            after: {
                start: 'opponent',
                lines: 3
            }
        }
    },
    [gameCharacters.garnet]: {
        [gameCharacters.peridot]: {
            before: {
                start: 'opponent',
                lines: 2
            },
            after: {
                start: 'opponent',
                lines: 2
            }
        },
        [gameCharacters.jasper]: {
            before: {
                start: 'opponent',
                lines: 2
            },
            after: {
                start: 'opponent',
                lines: 2
            }
        },
        [gameCharacters.y_diamond]: {
            before: {
                start: 'player',
                lines: 4
            },
            after: {
                start: 'player',
                lines: 2
            }
        }
    },
    [gameCharacters.pearl]: {
        [gameCharacters.peridot]: {
            before: {
                start: 'opponent',
                lines: 2
            },
            after: {
                start: 'opponent',
                lines: 3
            }
        },
        [gameCharacters.jasper]: {
            before: {
                start: 'player',
                lines: 2
            },
            after: {
                start: 'player',
                lines: 2
            }
        },
        [gameCharacters.y_diamond]: {
            before: {
                start: 'player',
                lines: 4
            },
            after: {
                start: 'player',
                lines: 3
            }
        }
    },
    [gameCharacters.amethyst]: {
        [gameCharacters.peridot]: {
            before: {
                start: 'opponent',
                lines: 3
            },
            after: {
                start: 'player',
                lines: 2
            }
        },
        [gameCharacters.jasper]: {
            before: {
                start: 'player',
                lines: 2
            },
            after: {
                start: 'opponent',
                lines: 2
            }
        },
        [gameCharacters.y_diamond]: {
            before: {
                start: 'opponent',
                lines: 3
            },
            after: {
                start: 'player',
                lines: 2
            }
        }
    },
    [gameCharacters.peridot]: {
        [gameCharacters.peridot]: {
            before: {
                start: 'player',
                lines: 3
            },
            after: {
                start: 'player',
                lines: 2
            }
        },
        [gameCharacters.jasper]: {
            before: {
                start: 'opponent',
                lines: 2
            },
            after: {
                start: 'player',
                lines: 1
            }
        },
        [gameCharacters.y_diamond]: {
            before: {
                start: 'player',
                lines: 6
            },
            after: {
                start: 'opponent',
                lines: 3
            }
        }
    },
    [gameCharacters.jasper]: {
        [gameCharacters.peridot]: {
            before: {
                start: 'player',
                lines: 3
            },
            after: {
                start: 'player',
                lines: 2
            }
        },
        [gameCharacters.jasper]: {
            before: {
                start: 'player',
                lines: 3
            },
            after: {
                start: 'player',
                lines: 1
            }
        },
        [gameCharacters.y_diamond]: {
            before: {
                start: 'player',
                lines: 6
            },
            after: {
                start: 'opponent',
                lines: 4
            }
        }
    },
    [gameCharacters.y_diamond]: {
        [gameCharacters.peridot]: {
            before: {
                start: 'player',
                lines: 5
            },
            after: {
                start: 'player',
                lines: 3
            }
        },
        [gameCharacters.jasper]: {
            before: {
                start: 'player',
                lines: 3
            },
            after: {
                start: 'player',
                lines: 3
            }
        },
        [gameCharacters.y_diamond]: {
            before: {
                start: 'player',
                lines: 3
            },
            after: {
                start: 'player',
                lines: 1
            }
        }
    }
}