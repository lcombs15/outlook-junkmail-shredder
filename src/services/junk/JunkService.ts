import Email from "../../entity/email";
import {JunkStrategy} from "./strategy/JunkStrategy";
import {BogusNewsletterStrategy} from "./strategy/BogusNewsletterStrategy";
import {BogusOnMicrosoftStrategy} from "./strategy/BogusOnMicrosoftStrategy";
import {LooksLikeMyEmailStrategy} from "./strategy/LooksLikeMyEmailStrategy";
import {IllegalTopLevelDomainStrategy} from "./strategy/IllegalTopLevelDomainStrategy";
import {IllegalDomainStrategy} from "./strategy/IllegalDomainStrategy";
import {DontKnowMyNameDotInfo} from "./strategy/DontKnowMyNameDotInfo";

export interface JunkEvaluation {
    isJunk: boolean,
    reason: string,
}

export class JunkService {

    constructor(private strategies: Array<JunkStrategy> = [
        new BogusNewsletterStrategy(),
        new IllegalTopLevelDomainStrategy(),
        new IllegalDomainStrategy(),
        new DontKnowMyNameDotInfo(),
        new BogusOnMicrosoftStrategy(),
        new LooksLikeMyEmailStrategy()
    ]) {
    }

    public evaluate(email: Email): JunkEvaluation {
        const match = this.strategies.find(strat => strat.appliesTo(email));

        return {
            isJunk: !!match,
            reason: match?.getReason(email) || 'No matching junk filter'
        }
    }
}
