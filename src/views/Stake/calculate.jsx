
export function getDiceWinAmount(playerChoice, amount, modulo) {
    if(isNaN(amount) || amount <= 0){
        amount = 0.01;
    }

    amount = amount * (10**18)
    const HOUSE_EDGE_PERCENT = 1;
    const HOUSE_EDGE_MINIMUM_AMOUNT = 300000000000000;
    const JACKPOT_FEE = 1000000000000000;
    const MIN_JACKPOT_BET = 100000000000000000;
    // const rollUnder = getRollUnder(playerChoice, modulo)
     const rollUnder = playerChoice.length;

    let houseEdge = amount * HOUSE_EDGE_PERCENT / 100;

    const jackpotFee = amount >= MIN_JACKPOT_BET ? JACKPOT_FEE : 0;


    if (houseEdge < HOUSE_EDGE_MINIMUM_AMOUNT) {
        houseEdge = HOUSE_EDGE_MINIMUM_AMOUNT;
    }

    const winAmount = (amount - houseEdge - jackpotFee) * modulo / rollUnder;
    return { winAmount:winAmount/10**18, jackpotFee, amount }

}

export function getRollUnder(playerChoice, modulo){
    let betMask = getBetMask(playerChoice, modulo);
    // let betMask = 1;
    
    const BN = Web3.utils.BN;

    let POPCNT_MULT = '0000000000002000000000100000000008000000000400000000020000000001';
    let POPCNT_MASK = '0001041041041041041041041041041041041041041041041041041041041041';
    let POPCNT_MODULO = '63';

    betMask = new BN(betMask, 10);
    POPCNT_MULT = new BN(POPCNT_MULT, 16);
    POPCNT_MASK = new BN(POPCNT_MASK, 16);
    POPCNT_MODULO = new BN(POPCNT_MODULO, 16);

    

    let MAX_MASK_MODULO = 40
    let rollUnder;
    if (modulo <= MAX_MASK_MODULO) {
        rollUnder = betMask.mul(POPCNT_MULT).and(POPCNT_MASK).mod(POPCNT_MODULO).toString(10)
    } else {
        rollUnder = betMask;
    }
    return +rollUnder
}

export function getBetMask(playerChoice, modulo) {
    let result = '';
    let betMask = 0;
    if (modulo === 2) {
        result = playerChoice[0].toString();
    } else if (modulo === 6) {
        for (let i = 0; i < playerChoice.length; i++) {
            betMask = betMask + Math.pow(2, +playerChoice[i] - 1)
        }
        result = betMask.toString()

    } else if (modulo === 36) {
        playerChoice.forEach(sumOfDice => {
            for (let i = 1; i <= 6; i++) {
                for (let j = 1; j <= 6; j++) {
                    if ((i + j) === sumOfDice) {
                        betMask = betMask + Math.pow(2, 6 * (i - 1) + (j - 1));
                    }
                }
                result = betMask.toString();
            }
        });
    } else if (modulo === 37) {
        let binary = null
        binary = ''
        playerChoice
            .slice()
            .reverse()
            .forEach(function (x) {
                binary = binary.concat(x)
            })

        return parseInt(binary, 2)

    } else if (modulo === 100) {
        result = playerChoice[0].toString();
    }

    return result
}
