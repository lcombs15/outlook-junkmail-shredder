import { JunkService } from "./JunkService";
import { buildEmail } from "../../tools/buildEmail";

describe("JunkService", () => {
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
        "paolosannasup@tiscali.it",
        "renewbrextg@mymobeldz.com",
        "AARP.xlUKk@mymobeldz.com",
        "Solana.grge5@supervivedoob.info",
        "newsletter@supervivedoob.info",
        "noreply@67._comixstapless.store",
        "Cloud-Storage.team.11686@Account-Services.74394.KLUNIVERSITYH.IN",
        "news@viewseven.com",
        "sleepgrambamboosheetsaff@yourbestprofits.com",
        "UnitedHealthcare.5969298969221@Oral-B.DentalKit-700949423401991.SMANEGERI4KENDARI.ONMICROSOFT.COM",
        "Account-Protection.Services-5717153534469@Total.Protection-129814014458812.THDEDU.ONMICROSOFT.COM",
        "CBS-Health.News.7335736462488@Medical.Desk-880091691160419.THDEDU.ONMICROSOFT.COM",
        "Cloud-Security.4522220898076@Updates.733541193833446.CNCEDUHK.ONMICROSOFT.COM",
        "Gelatin.Sculpt-Diet.0393266719851@Breaking-News.245123495455033.SLTZN.ONMICROSOFT.COM",
        "Gundry.MD-8125195668313@Updates.73907.PGKMANDALPUNE.ONMICROSOFT.COM",
        "Health-Update.7390536499740@Weight-Loss-Discovery.000446696866186.PGKMANDALPUNE.ONMICROSOFT.COM",
        "Ringing.Ears-Protocol.5359200503755@CNN.World.060501310008260.APSCHEEDU.ONMICROSOFT.COM",
        "Tinnitus.UPDATE1504003262886@Dr.Oz-269424378562584.CNCEDUHK.ONMICROSOFT.COM",
        "renew.5KVO7@ginnybedellphotography.com",
        "medvisupport@s96qskrgiftspecialty.com",
        "chargecardwireless@kn07k1bgiftspecialty.com",
        "Daily.Weight-Loss.8ENSS0GI5Y@Nutrition.1129499538905663.smanegeri4kendari.onmicrosoft.com",
        "Cloud.Admin.8310350389248555@Data.Retention7173221252609272.SMANEGERI4KENDARI.ONMICROSOFT.COM",
        "keraniquehair@suujr4starlincko.online",
        "bettersleepteam@1kqrlhstarlincko.online",
        "a🅟‍🅟‍le🅘‍d@‍🅘‍d.‍a🅟‍🅟‍le.‍c‍o🅜",
        "ap🅟‍le🅘‍d@‍🅘‍d.‍ap🅟‍le.‍c‍o🅜",
        "ap🅟‍le🅘‍d@‍🅘‍d.‍a🅟‍🅟‍le.‍c‍o🅜",
        "a🅟‍p🅛‍e🅘‍d@‍🅘‍d.‍a🅟‍p🅛‍e.‍c‍o🅜",
        "a🅟‍p🅛‍🅔‍🅘‍🅓‍@‍🅘‍🅓‍.‍a🅟‍🅟‍🅛‍🅔‍.‍c‍o🅜",
        "a🅟‍🅟‍le🅘‍d@‍🅘‍d.‍a🅟‍ple.‍c‍o🅜",
        "🅐‍🅟‍🅟‍🅛‍ei🅓‍@‍🅘‍d.‍a🅟‍🅟‍🅛‍e.‍c‍o🅜",
        "🅐‍🅟‍🅟‍🅛‍e🅘‍d@‍i🅓‍.‍a🅟‍🅟‍le.‍c‍o🅜",
        "🅐‍🅟‍🅟‍🅛‍e🅘‍🅓‍@‍i🅓‍.‍a🅟‍🅟‍🅛‍e.‍c‍o🅜",
        "no-reply@mail-donfranklinhardincountyford.intdash.com",
        "trugreenpartner@i5g6oupskystoria.online",
        "reversemortgageassist@y0mya3hskystoria.online",
        "saatvaadvertisement@tnhrsx9alfresku.com",
        "saatvaadvertisement@21drb4talfresku.com",
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
        "appleid@id.apple.com",
    ];

    const service = new JunkService();

    it("should mark emails as junk", () => {
        const result = junkEmailsAddress
            .map(buildEmail)
            .map((input) => {
                return {
                    input,
                    result: service.evaluate(input),
                };
            })
            .filter((result) => !result.result.isJunk)
            .map((result) => result.input.from.emailAddress.address);

        expect(result).toHaveLength(0);
    });

    it("should NOT mark emails as junk", () => {
        const result = notJunkEmails
            .map(buildEmail)
            .map((input) => {
                return {
                    input,
                    result: service.evaluate(input),
                };
            })
            .filter((result) => result.result.isJunk)
            .map((result) => result.input.from.emailAddress.address);

        expect(result).toHaveLength(0);
    });

    it("should not have any duplicate test data", () => {
        expect(new Set(junkEmailsAddress).size).toBe(junkEmailsAddress.length);
        expect(new Set(notJunkEmails).size).toBe(notJunkEmails.length);
    });

    it("Should handle an invalid email address", () => {
        const result = service.evaluate(buildEmail(undefined));

        expect(result).toBeTruthy();
        expect(result.isJunk).toBe(false);
    });
});
