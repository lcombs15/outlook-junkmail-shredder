import {JunkSummaryReportService} from './JunkSummaryReportService';
import Email from '../entity/email';

describe('JunkSummaryReportService', () => {
    const service = new JunkSummaryReportService();

    describe('formatEmailOneLine', () => {
        it('should format email information into a single line', () => {
            const mockEmail: Email = {
                id: '123',
                receivedDateTime: '2025-08-01T14:25:00Z',
                subject: 'Test Subject',
                from: {
                    emailAddress: {
                        name: 'John Doe',
                        address: 'john.doe@example.com'
                    }
                },
                sender: {
                    emailAddress: {
                        name: 'John Doe',
                        address: 'john.doe@example.com'
                    }
                },
                toRecipients: [],
                ccRecipients: [],
                bccRecipients: [],
                body: {
                    contentType: 'text',
                    content: 'Test content'
                }
            };

            const result = service.formatEmailOneLine(mockEmail);

            expect(result).toMatchSnapshot();
        });

        it('should trim whitespace from sender name', () => {
            const mockEmail: Email = {
                id: '456',
                receivedDateTime: '2025-08-01T14:25:00Z',
                subject: 'Another Test Subject',
                from: {
                    emailAddress: {
                        name: '  Jane Smith  ',
                        address: 'jane.smith@example.com'
                    }
                },
                sender: {
                    emailAddress: {
                        name: 'Jane Smith',
                        address: 'jane.smith@example.com'
                    }
                },
                toRecipients: [],
                ccRecipients: [],
                bccRecipients: [],
                body: {
                    contentType: 'text',
                    content: 'Another test content'
                }
            };

            const result = service.formatEmailOneLine(mockEmail);

            expect(result).toMatchSnapshot();
        });
    });
});
