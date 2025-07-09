import {JunkEvaluation} from "./junk/JunkService";
import {JunkReport, JunkReportSection} from "../entity/junk-report";
import Email from "../entity/email";

export class JunkSummaryReportService {

    public getReport(evaluations: Array<{ evaluation: JunkEvaluation, email: Email }>): JunkReport {
        const report: JunkReport = {
            junkReport: {},
            notJunkReport: {}
        }

        evaluations.forEach(({evaluation, email}) => {
            const reportEntry = evaluation.isJunk ? report.junkReport : report.notJunkReport;

            reportEntry[evaluation.reason] = reportEntry[evaluation.reason] || [];
            reportEntry[evaluation.reason].push(email)
        })

        return report;
    }

    public printReport(report: JunkReport): void {
        this.printSection('JUNK', report.junkReport);
        this.printSection('NOT JUNK', report.notJunkReport);
    }

    public formatEmailOneLine(email: Email): string {
        return `${email.from.emailAddress.name.trim()} <${email.from.emailAddress.address}> : ${email.subject}`
    }

    private printSection(title: string, section: JunkReportSection): void {
        console.log(`${title} (${this.getSectionSize(section)}):`);
        Object.entries(section).forEach(([reason, emails]) => {
            console.log(`\t${reason} (${emails.length})`);
            emails.forEach(email => {
                console.log(`\t\t+ ${this.formatEmailOneLine(email)}`
                    .replace(/[\r\n]+| {2,}/g, ''))
            })
        })
        console.log(new Array(80).fill('=').join(''))
    }

    private getSectionSize(section: JunkReportSection): number {
        const counts = Object.values(section).map(section => section.length)
        return counts.reduce((sum, count) => sum + count, 0);
    }
}
