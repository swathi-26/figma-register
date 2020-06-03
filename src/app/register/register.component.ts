import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { RegisterService } from './register.service'

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  activeTab = 0;
  personaldetailSubmitted: boolean = false;
  companydetailSubmitted: boolean = false;
  verifiedUser: boolean = false;
  regForm: FormGroup;
  personalDetails: FormGroup;
  companyDetails: FormGroup;
  image;
  isTermsChecked = false;
  otp = '';
  reader = new FileReader();
  config = {
  allowNumbersOnly: true,
  length: 5,
  isPasswordInput: false,
  disableAutoFocus: false,
  inputStyles: {
    'width': '50px',
    'height': '50px',
    'margin-right': '14px'
    }
  };
  telOptions = {initialCountry: 'in', preferredCountries: []};
  countryList;
  stateList;
  countryStateMap;
  countryCode ="91";
  gender;
  constructor(private formBuilder: FormBuilder, private registerService: RegisterService) {
    this.registerService.getCountryData().subscribe((data) => {
      this.countryStateMap = data['countries'];
      this.countryList = data['countries'].map((ele)=>{
        return ele['country']
      })
    });
  }

  ngOnInit() {
    this.personalDetails =  this.formBuilder.group({
      'fullName': new FormControl(null, [Validators.required, Validators.pattern("^[a-zA-Z]+[\\s][a-zA-Z]+$")]),
      'gender': new FormControl(null),
      'country': new FormControl(null, Validators.required),
      'state': new FormControl({value:null,disabled: true}),
      'phone': new FormControl(null, [Validators.required, Validators.pattern("^[\(0-9.+-\\s\)]{8,15}$")]),
    })

    this.companyDetails = this.formBuilder.group({
      'companyName': new FormControl(null, [Validators.required, Validators.pattern("^[a-zA-Z\\s]{3,}$")]),
      'email': new FormControl(null, [Validators.required, Validators.pattern("^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-z]{2,4}$")]),
      'jobTitle': new FormControl(null, [Validators.required, Validators.pattern("^[a-zA-Z\\s]{3,}$")]),
      'experience': new FormControl(null, [Validators.pattern("^[0-9.]{1,3}$"),Validators.min(0), Validators.max(50)]),
    })
  }

  get personalDetailsControl() {
    return this.personalDetails.controls;
  }

  get companyDetailsControl() {
    return this.companyDetails.controls;
  }
  next(){
    if(this.activeTab == 2){
      this.activeTab+=1;
      var details = {
        personalDetails: this.personalDetails.value,
        companyDetails: this.companyDetails.value
      }
      details.companyDetails['logo'] = this.image;
      localStorage.setItem('userDetails', JSON.stringify(details));
      this.verifiedUser = true;
      return
    }
    if(this.activeTab == 1){
      this.companydetailSubmitted = true;
      if(this.companyDetails.valid){
        this.activeTab+=1;
      }
      return;
    }
    
    if(this.activeTab == 0){
      this.personaldetailSubmitted = true;
      this.personalDetails.value.phone = "+" + this.countryCode + this.personalDetails.value.phone;
      let gender = document.getElementsByName('gender');
      for(var i=0; i<gender.length;i++){
        if(gender[i]['checked'] == true){
          this.personalDetails.value.gender = gender[i]['value'];    
        }
      }
      
      if(this.personalDetails.valid){
        this.activeTab+=1;
      }
    }
  }
  previous(){
    this.activeTab-=1
  }

  onGenderClick(value){
    this.gender = value;
    console.log("gende",value)
    this.personalDetails.value.gender = value;
  }

  upload(files){
    if (files && files[0]) {
      this.reader.readAsDataURL(files[0]);

      this.reader.onloadend = (event) => {
        this.image = this.reader.result;
        console.log(this.image)
      }
    }
  }

  onOtpChange(event){
    this.otp = event;
  }

  onCountryChange(){
    this.personalDetailsControl['state'].enable();
    this.stateList = this.countryStateMap.find(ele=> ele['country'] == this.personalDetails.value.country)['states']
  }

  telInputObject(event){
    console.log("telInputObject", event);
  }
  
  onCountryCodeChange(event){
    this.countryCode = event['dialCode']
  }
}
