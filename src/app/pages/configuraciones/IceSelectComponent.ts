import { OnInit } from "@angular/core";
import { ControlValueAccessor } from "@angular/forms";

export class IceSelectComponent implements ControlValueAccessor {
    selectedValue:any;
    propagateTouched:any;


    public writeValue(value: any) {
      this.selectedValue = value;
    }

    public registerOnChange(fn) {
      this.selectedValue = fn;
    }

    public registerOnTouched(fn){
      this.propagateTouched = fn;
    }




}
