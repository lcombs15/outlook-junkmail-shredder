import {JunkStrategy} from "./JunkStrategy";
import Email from "../../../entity/email";

export class IllegalDomainStrategy implements JunkStrategy {
    private readonly illegalDomains = [
        "_stenonbloc.online",
        "martingifts.com",
        "myelectroshops.com",
        "adaptiveinfrastructuremanagement.info",
        "langballig.info",
        "unhjkuion.com",
        "totallydiabetes.com",
        "frenchmahoroba.com",
        "cyxtensible.com",
        "brightidzdaseasmd.com",
        "conferenceplacemat.com",
        "lindsaykeefeyoga.ca",
        "deesmobileworkshops.ca",
        "fffoundationltd.com",
        "viajesalsahara.com",
        "beritamedika.com",
    	"primeeconomicreview.com",
    	"gurturmadencilik.com",
    	"eatcheesecakes.com",
    	"approachcheese.pro",
    	"substack.com",
        "abigimdlmore.work",
        'com.br',
        'ac-inbox.com'
    ];

    appliesTo(email: Email): boolean {
        const emailAddress = email.from.emailAddress.address;
        const domain = emailAddress.split('@')[1];

        return this.illegalDomains.some(illegalDomain => domain.endsWith(illegalDomain));
    }

    getReason(email: Email): string {
        return "Email from known illegal domain";
    }
}
