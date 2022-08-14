import { Row, Worksheet } from 'exceljs';

export class InitWorksheetDto {
  actionColIndex: number;
  headers: any[];
  headerRow: Row;
  worksheet: Worksheet;
}
