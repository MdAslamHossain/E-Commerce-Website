import { Component, OnInit, AfterViewInit} from '@angular/core';
import { NgwWowService } from 'ngx-wow';
import { ProductService } from '../manage/manage.service';
import { UploadFileService } from '../manage/manage.file-service';
import { Category } from '../manage/category';
import { ActivatedRoute, Router } from '@angular/router';
import { Carousel } from '../manage/carousel';
import { EmailSending } from '../manage/manage.email';
import { Item } from '../cart-entities/item';
import { Product } from '../cart-entities/product';
import { ProductServiceForCart } from '../app.cart-service';
import { Fb } from '../manage/fb';
import { Twitter } from '../manage/twitter';
import { Alert } from 'selenium-webdriver';
import { AngularFireAuth } from '@angular/fire/auth';
import { ThirdPartyProduct } from '../manage/thirdparty-product';

import { auth as authen } from 'firebase';
import { Phone } from '../manage/phone';
import { Email } from '../manage/email';
import { PaymentPhoneNumber } from '../manage/payment-number';
declare var jquery:any;
declare var $ :any;

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit{
 
 product=new Product();
 products:Product[];
thirdPartyProduct=new ThirdPartyProduct();
 
 category=new Category();
 categories:Category[];
 carousels:Carousel[];
 emailSending=new EmailSending();
 // FOR FILE
selectedpFiles: FileList;

selectedtpFiles: FileList;



selectedgmFiles: FileList;
//for carousel files
selectedCFiles: FileList;
carousel=new Carousel();
fb=new Fb();
fbLink=new Fb();
twitter=new Twitter();
twitterLink=new Twitter();


phone=new Phone();
phones:Phone[];

paymentPhone=new PaymentPhoneNumber();



email=new Email();
emails:Email[];







//-------for cart--------
id:string;
quantity:number;
items: Item[] = [];
total: number = 0;
cartNumber:number=0;
//-----------------------
emailUid='qCv0iprRpzcdX5eLSaP6WMpV9X73';
fbUid='7fHZCwUlZyfLPm8ScDVkOkswM932';


  uid: string;
  authenticatedName: any;
  photoUrl: string;

//----------------------
  constructor(private ngWowService:NgwWowService,private productService:ProductService,
    private uploadFileService:UploadFileService,private router:Router,private activatedRoute:ActivatedRoute,
    private productServiceForCart:ProductServiceForCart,public af: AngularFireAuth){
     // this.getAllCarousel();
      this.loginProperties();
    
  }
 

  ngOnInit() {

this.getAllCategories();
this.getAllCarousel();
this.getFb();
this.getTwitter();
this.getAllPhones();
this.getAllEmails();
//-----------navbar collapse hide if click link-----------------
$('.nav-item').on('click', function(){
  $('.navbar-collapse').collapse('hide');
});

//tool tip
$('[data-toggle="tooltip"]').tooltip();
//-------NOT CHANGE BELOW CODE SEQUENCE---------------------------------------------------------------
//----------------for cart---------------
this.products=this.productServiceForCart.findAll();
this.id=this.activatedRoute.snapshot.paramMap.get('id');
this.quantity=+this.activatedRoute.snapshot.paramMap.get('quantity');


//-------------check price quantity two---if two then redirect to cart page--------

if (localStorage.getItem('cart') != null) {
  
let cart: any = JSON.parse(localStorage.getItem('cart'));
 
    for (var i = 0; i < cart.length; i++) {
      let item: Item = JSON.parse(cart[i]);
      if (item.product.id == this.id) {

        // check if already 2
        if(item.quantity==2){
          alert('The quantity of this product is already 2. Try other products !')
          //return is used to prevent next execution
         return this.router.navigate(['productDetails',this.id]);
                  }



        // check if already 1 but try to cart 2 or more
        if(this.quantity>=2 && item.quantity==1){
          
          
          

   alert('We have 2 in stock for you !');
  //return is used to prevent next execution
 return this.router.navigate(['productDetails',this.id]);
        }




          
      }
    }
  }
  
  //-------add cart count------------------
if(this.id){

if(this.quantity<=2){



  if(+localStorage.getItem('cartNumber')!=0){

    this.cartNumber=+localStorage.getItem('cartNumber')+1;

    localStorage.setItem('cartNumber',JSON.stringify(this.cartNumber));
  }else{

    localStorage.setItem('cartNumber',JSON.stringify(1));
  }

}else{

  alert('We have 2 in stock for you !');
//return is used to prevent next execution
return this.router.navigate(['productDetails',this.id]);


}





}
//------------------------------------------------
//initialize item
if (this.id) {

if(this.quantity<=2){



  var item: Item = {
    product: this.productServiceForCart.find(this.id),
    quantity: this.quantity,
    cart1:1,
    cart2:1
  };
}else{

  alert('We have 2 in stock for you !');
//return is used to prevent next execution
return this.router.navigate(['productDetails',this.id]);


}




  // when first cart
  if (localStorage.getItem('cart') == null) {


    if(this.quantity<=2){

    let cart: any = [];
    item.cart2=0;
    cart.push(JSON.stringify(item));
    localStorage.setItem('cart', JSON.stringify(cart));


    }else{

      alert('We have 2 in stock for you !');
  //return is used to prevent next execution
 return this.router.navigate(['productDetails',this.id]);


    }
  } else {
    // when any number cart exist
    let cart: any = JSON.parse(localStorage.getItem('cart'));
    let index: number = -1;

    if(localStorage.getItem('cart')!=null){

    
    for (var i = 0; i < cart.length; i++) {
      let item: Item = JSON.parse(cart[i]);
      if (item.product.id == this.id) {
        index = i;
        break;
      }
    }
  }


    //check cart exist but this id not exist
    if (index == -1) {
      item.cart2=0;
      cart.push(JSON.stringify(item));
      localStorage.setItem('cart', JSON.stringify(cart));
      
    } 
    //cart exist and same id exist
    else {
      let item: Item = JSON.parse(cart[index]);
      item.quantity += this.quantity;
      item.cart2=1;
      cart[index] = JSON.stringify(item);
      localStorage.setItem("cart", JSON.stringify(cart));
      
    }
  }
  this.loadCart();
  
} else {
  this.loadCart();
}

//----------------------------------------

// check null to remove browser error
if(this.id!=null){

  this.router.navigate(['productDetails',this.id]);
}

  }
  

  //GOOGLE MAP
  selectgmFile(event){
    this.selectedgmFiles=event.target.files;
  }

// FOR FILE UPLOAD
selectpFile(event) {
  this.selectedpFiles = event.target.files;
}
selecttpFile(event) {
  this.selectedtpFiles = event.target.files;
}
// CAROUSEL FILES UPLOAD
selectCFile(event) {
  this.selectedCFiles = event.target.files;
  console.log(this.selectedCFiles);
}

addCarouselPictures(){
this.uploadFileService.pushCarouselFileToStorage(this.selectedCFiles)
.subscribe(response =>{
  if(response.statusText==='OK'){
    this.resetCarousel();
this.getAllCarousel();

$("#validMsgModal").modal('show');



  }
},
(error)=>{
  this.resetCarousel();
  this.getAllCarousel();

  $("#errorMsgModal").modal('show');


});
}


addgmPicture(){

  this.uploadFileService.pushgmFileToStorage(this.selectedgmFiles.item(0))
  .subscribe(response =>{
    if(response.statusText==='OK'){
      this.resetgmFile();


      $("#validMsgModal").modal('show');
    }
  },
  (error)=>{
    this.resetgmFile();
    $("#errorMsgModal").modal('show');
  });
  }
  
  resetgmFile(){
    this.selectedgmFiles=null;
  }

resetCarousel():void{
  this.carousel=new Carousel();
  this.selectedCFiles=null;
}


  uploadFile() {
    this.uploadFileService.pushFileToStorage(this.selectedpFiles)
      .subscribe(response => {
        if (response.statusText === 'OK') {
          this.addProduct();
        }
      },
        (error) => {
          this.productReset();
          $("#errorMsgModal").modal('show');
        }
      );
  }





  
  // ADD CONSUMERS
  addProduct(): void {
    this.productService.addProduct(this.product)
      .subscribe(response => {
        if (response.statusText === 'OK') {
          
          this.productReset();
          this.loadPage();
          $("#validMsgModal").modal('show');


        }
      },
        (error) => {
          $("#errorMsgModal").modal('show');
        });
  }
  
loadPage(){
  if (!localStorage.getItem('foo')) { 
    localStorage.setItem('foo', 'no reload') 
    location.reload() 
  } else {
    localStorage.removeItem('foo') 
  
  }
}


  uploadThirdPartyFile() {
    this.uploadFileService.pushThirdPartyFileToStorage(this.selectedtpFiles)
      .subscribe(response => {
        if (response.statusText === 'OK') {
          this.addThirdPartyProduct();
        }
      },
        (error) => {
        
          this.productReset();

          $("#errorMsgModal").modal('show');
        }
      );
  }


  addThirdPartyProduct(): void {
    this.productService.addThirdPartyProduct(this.thirdPartyProduct)
      .subscribe(response => {
        if (response.statusText === 'OK') {
       
          this.thirdPartyProductReset();
          $("#validMsgModal").modal('show');
        }
      },
        (error) => {
          $("#errorMsgModal").modal('show');
        });
  }

  thirdPartyProductReset(){
    this.thirdPartyProduct=new ThirdPartyProduct();
  }

 getAllCarousel(): void {
        this.productService.getAllCarousel()
        .subscribe((carousel) => {


          this.carousels = carousel.slice(1);
       
        },
        (error) => {
          console.log(error);
        });
          }

  getAllCategories(): void {
    this.productService.getAllCategories()
    .subscribe((categories) => {
      this.categories = categories;
     
    },
    (error) => {
      console.log(error);
    });
      }
    
      addCategory(): void {
        this.productService.addCategory(this.category)
          .subscribe(response => {
            if (response.statusText === 'OK') {
          
              this.categoryReset();
              this.getAllCategories();

              $("#validMsgModal").modal('show');


            }
          },
            (error) => {
              $("#errorMsgModal").modal('show');
              
            });
      }


      sendingEmail(): void {
        this.productService.emailSending(this.emailSending)
          .subscribe(response => {
            if (response.statusText === 'OK') {
              this.emailSending=new EmailSending();
              $("#validMsgModal").modal('show');
            
            }
          },
            (error) => {
              $("#errorMsgModal").modal('show');
              
            });
      }
      

      categoryReset():void{
        this.category=new Category();

}
productReset():void{
  this.product=new Product();

}
refreshEmail(){
  this.emailSending=new EmailSending();
}
//----------------cart---------------


loadCart(): void {
  this.total = 0;
  this.items = [];
  let cart = JSON.parse(localStorage.getItem('cart'));
// check cart null,,because after removing all cart the local storage cart is null
if(localStorage.getItem('cart')!=null){


 
  for (var i = 0; i < cart.length; i++) {
    let item = JSON.parse(cart[i]);
    this.items.push({
      product: item.product,
      quantity: item.quantity,
      cart1:item.cart1,
      cart2:item.cart2

    });
      
    this.total += item.product.soldPrice * item.quantity;
  }

}


  localStorage.setItem('total',JSON.stringify(this.total));
  //---------------------load cart count-------
  this.cartNumber=+localStorage.getItem('cartNumber');
}

remove(id: string): void {
  let cart: any = JSON.parse(localStorage.getItem('cart'));
  let index: number = -1;
if(localStorage.getItem('cart')!=null){



  for (var i = 0; i < cart.length; i++) {
    let item: Item = JSON.parse(cart[i]);
    if (item.product.id == id) {
      cart.splice(i, 1);

  //-------------------remove cart count------
  this.cartNumber=+localStorage.getItem('cartNumber');
  let cn=this.cartNumber-+(item.cart1+item.cart2);
  if(cn<0){
    cn=0;
    localStorage.setItem('cartNumber',JSON.stringify(cn));
  }else{
    localStorage.setItem('cartNumber',JSON.stringify(cn));
    
  }


      break;
    }
  }

}



  localStorage.setItem("cart", JSON.stringify(cart));
  this.loadCart();

}
//--------------------------------------------

fbSave(){
  this.productService.addFb(this.fb)
  .subscribe(response => {
   if(response.statusText==='OK'){
     this.fb=new Fb();
     $("#validMsgModal").modal('show');
   } 
  },
  (error)=>{
    $("#errorMsgModal").modal('show');
  });
}





getFb():void{

this.productService.getFb()
.subscribe((response)=>{
  this.fbLink=response;
},
(error)=>{

});

}





twitterSave(){
  this.productService.addTwitter(this.twitter)
  .subscribe(response => {
   if(response.statusText==='OK'){
     this.twitter=new Twitter();
     $("#validMsgModal").modal('show');
   } 
  },
  (error)=>{
    $("#errorMsgModal").modal('show');
  });
}





getTwitter():void{

this.productService.getTwitter()
.subscribe((response)=>{
  this.twitterLink=response;
},
(error)=>{

});

}


loginProperties() {
  this.af.authState.subscribe(auth => {
    if (auth !== null) {
      if (!auth.displayName) {
        this.authenticatedName = auth.email;
      } else {
        this.authenticatedName = auth.displayName;
      }
      this.photoUrl = auth.photoURL;
      this.uid = auth.uid;
    }
  });
}


goToLogin(){
  this.router.navigateByUrl('login');
}
// LOGOUT
logout() {
  this.af.auth.signOut();
  this.authenticatedName = null;
  this.photoUrl = null;
  this.loginProperties();

}





loginFb() {
  this.af.auth.signInWithPopup(new authen.FacebookAuthProvider()).then(
    (success) => {
      this.loginProperties();
    }).catch(
      (err) => {

      });
}

loginGoogle() {
  this.af.auth.signInWithPopup(new authen.GoogleAuthProvider()).then(
    (success) => {
      this.loginProperties();
    }).catch(
      (err) => {
      });
}

deleteCategory(id:string){
  this.productService.deleteCategory(id).
  subscribe(response=>{
    if(response.statusText==='OK'){
      this.getAllCategories();
      $("#validMsgModal").modal('show');
    }
  },
  (error)=>{
    $("#errorMsgModal").modal('show');
  });
}










phoneSave(){
  this.productService.addPhone(this.phone)
  .subscribe(response => {
   if(response.statusText==='OK'){
     this.phone=new Phone();
     $("#validMsgModal").modal('show');
   } 
  },
  (error)=>{
    $("#errorMsgModal").modal('show');
  });
}

paymentPhoneSave(){

  this.productService.addPaymentPhoneNumber(this.paymentPhone)
  .subscribe(response => {
   if(response.statusText==='OK'){
     this.paymentPhone=new PaymentPhoneNumber();
     $("#validMsgModal").modal('show');
   } 
  },
  (error)=>{
    $("#errorMsgModal").modal('show');
  });
}



emailSave(){
  this.productService.addEmail(this.email)
  .subscribe(response => {
   if(response.statusText==='OK'){
     this.email=new Email();
     $("#validMsgModal").modal('show');
   } 
  },
  (error)=>{
    $("#errorMsgModal").modal('show');
  });
}


getAllPhones(): void {
  this.productService.getAllPhones()
  .subscribe((phones) => {


this.phones=phones;
 
  },
  (error) => {
    console.log(error);
  });
    }




    getAllEmails(): void {
      this.productService.getAllEmails()
      .subscribe((emails) => {
    
    
    this.emails=emails;
     
      },
      (error) => {
        console.log(error);
      });
        }
    


        deletePhone(id:string){
          this.productService.deletePhoneById(id).
          subscribe(response=>{
            if(response.statusText==='OK'){
              this.getAllPhones();
              $("#validMsgModal").modal('show');
            }
          },
          (error)=>{
            $("#errorMsgModal").modal('show');
          });
        }
        


        deleteEmail(id:string){
          this.productService.deleteEmailById(id).
          subscribe(response=>{
            if(response.statusText==='OK'){
              this.getAllEmails();
              $("#validMsgModal").modal('show');
            }
          },
          (error)=>{
            $("#errorMsgModal").modal('show');
          });
        }






}
