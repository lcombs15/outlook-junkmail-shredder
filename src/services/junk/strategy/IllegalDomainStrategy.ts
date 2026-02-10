import { JunkStrategy } from "./JunkStrategy";
import { Outlook } from "../../../entity/outlook";

export class IllegalDomainStrategy implements JunkStrategy {
    private readonly illegalDomains = [
        "_stenonbloc.online",
        "_ecoenergi.online",
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
        "com.br",
        "ac-inbox.com",
        "·onmicrosoft.·com",
        "dogchitchat.com",
        "mail-donfranklinmitsubishi.intdash.com",
        "verenagros.com",
        "shibeatdoge.com",
        "beehiiv.com",
        "tiscali.it",
        "mymobeldz.com",
        "supervivedoob.info",
        "keymmodore.com",
        "sakranvillage.com",
        "_comixstapless.store",
        "KLUNIVERSITYH.IN",
        "viewseven.com",
        "yourbestprofits.com",
    ];

    appliesTo(email: Outlook.Email): boolean {
        const emailAddress = email.from.emailAddress.address;
        const domain = emailAddress?.split("@")[1] || "";

        return this.illegalDomains.some((illegalDomain) =>
            domain.endsWith(illegalDomain),
        );
    }

    getReason(email: Outlook.Email): string {
        return "Email from known illegal domain";
    }
}
