import { Component, OnInit } from "@angular/core";
import { Form, FormControl, FormGroup } from '@angular/forms';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';

@Component({
    selector: "app-landing",
    templateUrl: "./landing.component.html",
    styleUrls: ["./landing.component.css"]
})
export class LandingComponent implements OnInit {
    
    // Pre Brew Calculations
    // - Strike Temp
    // - Strike Vol
    // - Abs Vol
    // - First Runnings Vol
    // - Sparge Vol
    // - Est Pre Boil Grav
    // - Pre Boil Vol
    public targetMashTemp = 152.0;
    public grainWeight = 10.0;
    public absRate = 0.125;
    public evapRate = 0.5;
    public mashTunLoss = 0.21;
    public targetOg = 1.060;
    public batchVol = 5.0;
    
    public mashThickness: number; // .3125gal/lb
    public grainTemp: number;
    public strikeTemp: number; //(.2/(4*mashThickness))(targetMashTemp - grainTemp) + targetMashTemp
    public strikeVol: number; // grainWeight*mashThickness
    public absVol: number; // grainWeight * absRate
    public preboilVol: number; // batchVol + evapRate * boilHrs
    public firstRunningsVol: number; // strikeVol - (absVol + mashTunLoss)
    public spargeVol: number; // preboilVol - firstRunningsVol
    public estPreboilGrav: number; // (targetOg*targetVol)/preboilVol
    
    // Brew Corrections
    // - Raise Pre Boil Grav
    public collectedPreboilVol = 6.0;
    public measuredGrav = 1.045;
    public targetGrav = 1.065;
    // Weight of addition = (Volume of wort * (Target gravity – Measured gravity)) / Extract potential points of addition
    // Light DME Potential Extract: 1.045
    public dmeAdd: number;
    
    // Volume Measuring
    // Assuming holding pot and standing on scale
    // 8.32lbs/gal = 1kg/L
    // vol = (currWeight-emptyWeight)/(8.32*specificGrav)
    public currWeight = 12.0;
    public emptyWeight = 3.0;
    public specificGrav = 1.061;
    public currVol: number;
    
    // Post Brew Calculations
    // - Efficiency
    // - ABV
    public potentialGrav = 1.084;
    public measuredOG = 1.059;
    public measuredFG = 1.060;
    public efficiency: number;
    public abv: number;

    
    public mainGroup: FormGroup;


    constructor(private dialog: MatDialog){
    }
    
    ngOnInit(): void {
        this.mainGroup = new FormGroup({
            preBrewCalcsFG: new FormGroup({
                targetOg: new FormControl(this.targetOg),
                batchVol: new FormControl(this.batchVol),
                targetMashTemp: new FormControl(this.targetMashTemp),
                grainWeight: new FormControl(this.grainWeight),
                absRate: new FormControl(this.absRate),
                mashTunLoss: new FormControl(this.mashTunLoss),
                evapRate: new FormControl(this.evapRate),
            }),
            brewCorrectionsFG: new FormGroup({
                collectedPreboilVol: new FormControl(this.collectedPreboilVol),
                measuredGrav: new FormControl(this.measuredGrav),
                targetGrav: new FormControl(this.targetGrav),
            }),
            volMeasuringFG: new FormGroup({
                currWeight: new FormControl(this.currWeight),
                emptyWeight: new FormControl(this.emptyWeight),
                specificGrav: new FormControl(this.specificGrav),
            }),
            postBrewFG: new FormGroup({
                potentialGrav: new FormControl(this.potentialGrav),
                measuredOG: new FormControl(this.measuredOG),
                measuredFG: new FormControl(this.measuredFG)
            })
        });
        this.mashThickness = .3125;
        this.grainTemp = 68;

        this.mainGroup.valueChanges.subscribe(val => {
            this.onChanges();
        });

        this.onChanges();
    }

    public onChanges = (): void => {

        let vals = this.mainGroup.getRawValue();
        this.targetMashTemp = vals.preBrewCalcsFG.targetMashTemp;
        this.grainWeight = vals.preBrewCalcsFG.grainWeight;
        this.batchVol = vals.preBrewCalcsFG.batchVol;
        this.evapRate = vals.preBrewCalcsFG.evapRate;
        this.absRate = vals.preBrewCalcsFG.absRate;
        this.mashTunLoss = vals.preBrewCalcsFG.mashTunLoss;
        this.targetOg = vals.preBrewCalcsFG.targetOg;
        this.collectedPreboilVol = vals.brewCorrectionsFG.collectedPreboilVol;
        this.targetGrav = vals.brewCorrectionsFG.targetGrav;
        this.measuredGrav = vals.brewCorrectionsFG.measuredGrav;
        this.currWeight = vals.volMeasuringFG.currWeight;
        this.emptyWeight = vals.volMeasuringFG.emptyWeight;
        this.specificGrav = vals.volMeasuringFG.specificGrav;
        this.measuredOG = vals.postBrewFG.measuredOG;
        this.measuredFG = vals.postBrewFG.measuredFG;
        this.potentialGrav = vals.postBrewFG.potentialGrav;

        this.strikeTemp = (.2/(4*this.mashThickness)) * (this.targetMashTemp - this.grainTemp) + this.targetMashTemp;
        this.strikeVol = this.grainWeight * this.mashThickness;
        this.absVol = this.grainWeight * this.absRate;
        this.preboilVol = 0+this.batchVol + 1*this.evapRate;
        this.firstRunningsVol = this.strikeVol - (this.absVol + this.mashTunLoss);
        this.spargeVol = this.preboilVol - this.firstRunningsVol;
        let targetSG = this.convertToPts(this.targetOg);
        let preboilSG = (targetSG*this.batchVol)/this.preboilVol;
        this.estPreboilGrav = this.convertToGrav(preboilSG);

        // Weight of addition = (Volume of wort * (Target gravity – Measured gravity)) / Extract potential points of addition
        this.dmeAdd = (this.collectedPreboilVol * (this.convertToPts(this.targetGrav) - this.convertToPts(this.measuredGrav)))/45;

        this.currVol = (this.currWeight - this.emptyWeight)/(8.32 * this.specificGrav);

        this.efficiency = (1.0-this.measuredOG)/(1.0-this.potentialGrav);
        this.abv = (this.measuredOG-this.measuredFG) * 131.25;

    };

    public isGT(a: any, b: any): boolean {
        return a > b;
    }

    public isLT(a: any, b: any): boolean {
        return a < b;
    }

    private convertToPts(grav: number) {
        return (grav-1.0) * 1000;
    }

    private convertToGrav(pts: number) {
        return (pts/1000.0) + 1.0;
    }
}