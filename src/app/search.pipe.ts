import { Pipe, PipeTransform } from '@angular/core';
@Pipe({
    name: 'search'
})

export class SearchPipe implements PipeTransform {
    private searchKeyword: string = "";
    private Result = [];
    private Result1 = [];

    constructor() {

    }

    transform(items: any[], searchText: string): any[] {
        if (this.isObjNull(items)) return [-1];
        if (this.isObjNull(searchText)) return items;
        this.searchKeyword = searchText.toLowerCase();
        this.Result = items.filter(o => this.checkAgainstProperty(o.invoiceNo));
        this.Result1 = items.filter(o => this.checkAgainstProperty(o['studentId'].studentId));
        if (this.Result.length === 0 && this.Result1.length ===0) {
            return [-1];
        }else if(this.Result.length != 0){
            return this.Result;
        }
        else if(this.Result1.length != 0){
            return this.Result1;
        }else{
            return this.Result;
        }
    }

    private checkAgainstProperty(property: any): boolean {
        let value: boolean = false;
        if (!this.isNullOrWhiteSpace(property)) {
            if (property.toLowerCase().indexOf(this.searchKeyword.toLowerCase()) >= 0) {
                value = true;
            }
        }

        return value;
    }

    public isObjNull(obj: any, isNumber = false): boolean {
        let value: boolean = true;

        if (!isNumber && obj && obj != undefined && obj != null)
            value = false;
        else if (isNumber && obj != undefined && obj != null)
            value = false;

        return value;
    }

    public isNullOrWhiteSpace(obj: string): boolean {
        let value: boolean = true;

        if (!this.isObjNull(obj) && obj.trim() != "")
            value = false;

        return value;
    }
}