import {JunkService} from "./JunkService";
import Email from "../../entity/email";

describe('JunkService', () => {
    const junkEmailsAddress: Array<string> = [
        "12287674@Avadefaultlabsicu.onmicrosoft.com",
        "44516107@cqxstudnthqicu.onmicrosoft.com",
        "z03@Lisbonleadrealismshop.onmicrosoft.com",
        "alert_AofZqndQjdV@temikafieldenterprise.de",
        "donotreply@67._stenonbloc.online",
        "dontolzwnalysis@speed.absolutasaude.com.br",
        "enduranceautowarranty@martingifts.com",
        "energybillcruncher@martingifts.com",
        "exclusive@welcome.primeeconomicreview.com",
        "info@abenicotinic.quest",
        "info@abigimdlmore.work",
        "info@acoelousunplied.cyou",
        "info@approachcheese.pro",
        "jd@greenlifecashew.com.br",
        "news297806@zeleznockclick.onmicrosoft.com",
        "news343699@MeganMacdonald.onmicrosoft.com",
        "News121553@zbrdrsqeo21dj7wxnb.onmicrosoft.com",
        "newsletter@eatcheesecakes.com",
        "noreply@01._stenonbloc.online",
        "rbawindows@martingifts.com",
        "support@gurturmadencilik.com",
        "theadvancepros7163.activehosted.com@ac-inbox.com",
        "visionnewtime@substack.com",
        "support.l-combs@skyvb.nicolasmack.fun",
        "newsletter.tlrcidlnwkdfhdkhvfxfzawem@kjync.octroihereafter.cfd",
        "Hers+224@gfxdg.plumerpepperish.click",
        "McAfee+549@htzmn.popmcebox.store",
        "Medvi.vvyxslyi@tzspn.pulmdsepeakcraft.motorcycles",
        "hims_to_l-combs_kDABx5yyw6Ljidz@pzvuf.refelgoggly.life",
        "noreply+560@kglqu.prayingunstoked.life",
        "support@ylfal.hoselesscareless.cfd",
        "support@admin.·onmicrosoft.·com",
        "hims.klomgdwa@smrkw.leroyleach.sbs",
        "support@tmxcm.funnynxriver.fun",
        "Hims_ED.nawghfpt@crzlc.pulmdselineplus.website",
        "Hims_ED.dhhdqcri@tzspn.pulmdsepeakcraft.motorcycles",
        "Hims_ED.usyjihty@nulmz.pulmdsefleetclick.lat",
        "Hims_Partner@qrnbm.neofetusutopist.boats",
        "Hims_Partner@hwaau.hypmdeakly.space",
        "team-support@cqfeb.johnleonelli.biz.id",
        "team-support@wgurg.efuturenova.my.id",
        "newsletter.l-combs@nilware.com",
        "newsletter.l-combs@conferenceplacemat.com",
        "newsletter.omlpuhisvxkdseypzusmgpkks@ezpys.nexmdcraft.yachts",
        "Rylee.Schowalter.b6Qx2@lcsjthq.jodycunningham.biz.id",
        "Athena.Grant.zfrwd@kiowcfua.lenadodge.biz.id",
        "Tyrique.Wisozk.1xNz3@onkzou.lelandmaske.web.id",
        "noreply@42._ecoenergi.online",
        "renewhEEDO@dogchitchat.com",
        "no-reply@mail-donfranklinmitsubishi.intdash.com",
        "renew.VyRd3@verenagros.com",
        "enew.F9dTT@verenagros.com",
        "AAARewardswle@hotmail.com",
        "Starbuckscbu@hotmail.com",
        "UHCRewardseej@hotmail.com",
        "renewbavwtl@shibeatdoge.com",
        "Kristopher.Runolfsson.1Z9ph@cxaceygdj.stevenespinoza.my.id",
        "Adrianna.Paucek.Igl1h@ebqaabfr.stephaniepage.my.id",
        "info@omahasteakspbs.com",
        "info@omahasteakshpr.com",
        "huddle-website-signup@mail.beehiiv.com",
        "alessandroriccisup@tiscali.it",
        "paolosannasup@tiscali.it"
    ];

    const notJunkEmails: Array<string> = [
        "12milebeef@gmail.com",
        "zafer@algora.io",
        "support@amazon.com",
        "support@apple.com",
        "support@bbc.com",
        "orders@em.autozone.com",
        "news@jetbrains.com",
        "support@forbes.com",
        "support@myfitnesspal.com",
        "support@restomods.com",
        "firstlast@nku.onmicrosoft.com",
    ];

    function getEmail(address: string): Email {
        const tempEmail: Partial<Email> = {
            from: {
                emailAddress: {
                    address,
                    name: ''
                }
            }
        }

        return tempEmail as Email
    }

    const service = new JunkService();

    it('should mark emails as junk', () => {
        const result = junkEmailsAddress
            .map(getEmail)
            .map(input => {
                return {
                    input,
                    result: service.evaluate(input)
                }
            })
            .filter(result => !result.result.isJunk)
            .map(result => result.input.from.emailAddress.address);

        expect(result).toHaveLength(0);
    });

    it('should NOT mark emails as junk', () => {
        const result = notJunkEmails
            .map(getEmail)
            .map(input => {
                return {
                    input,
                    result: service.evaluate(input)
                }
            })
            .filter(result => result.result.isJunk)
            .map(result => result.input.from.emailAddress.address);

        expect(result).toHaveLength(0);
    });

    it('should not have any duplicate test data', () => {
        expect(new Set(junkEmailsAddress).size).toBe(junkEmailsAddress.length)
        expect(new Set(notJunkEmails).size).toBe(notJunkEmails.length)
    });
})
