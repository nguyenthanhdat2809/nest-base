import { format, writeToBuffer } from '@fast-csv/format';
import { writeToString } from 'fast-csv';
import { I18nRequestScopeService, I18nService } from 'nestjs-i18n';

class HeaderMap {
  from: string;
  to?: string;
}

export class CsvWriter {
  name: string;
  mapHeader: HeaderMap[];
  i18n: I18nRequestScopeService;
  async writeCsv(data: any): Promise<string> {
    this.mapHeader = await Promise.all(this.mapHeader.map(async (h) => {
      h.to = await this.i18n.translate(`header-csv.${this.name}.${h.from}`)
      return h;
    }));
    const buffer = await writeToBuffer(data, {
      headers: true,
      writeBOM: true,
      objectMode: true,
      writeHeaders: true,
      transform: (row) => {
        const toRow = {};
        this.mapHeader.map(async (h) => {
          toRow[h.to] = row[h.from] || row[h.from] == 0 ? row[h.from] : '';
        });
        return toRow;
      }
    });

    return buffer.toString();
  }
}
