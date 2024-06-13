import { Component, Input, OnInit, input } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { Product, Cart } from '../../interface';
import { CartService } from '../../service/cart/cart.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ComentService } from '../../service/coment/coment.service';
import { UserService } from '../../service/user/user.service';
import {Comment} from '../../interface'



@Component({
  selector: 'app-detail-product',
  templateUrl: './detail-product.component.html',
  styleUrl: './detail-product.component.css'
})
export class DetailProductComponent implements OnInit{
@Input()  data!: Product[];
replayComments: { [key: number]: any[] } = {};
cart:Cart[] =[];
soluong!:number;
trangcmtdangxem!:any;
showDetails!:boolean;
price!:any;
soluongs!:number;
nameproduct!:string;
imgae_product!:string;
datacart!:any;
id_seller!:number
comentform!:FormGroup;
description!:boolean;
id_product!:number;
currentTime!:any;
selectedFile!:any;
arruser!:any;
dalike!:boolean
dadislike!:boolean;
id_comentdephanhoi!:any
isModalOpen = false;
cmthoanchinh!:any;
replyForm!:FormGroup;
saosp!:any;
replaycoments!:any;
arridcoment:any[] =[];
allcoment!:any[];
sobutton:any[] =[];
coment:boolean = false;
stars:boolean[] = [false, false,false,false,false]
  constructor(private userservice:UserService, private route: ActivatedRoute, private http: HttpClient, private cartadd:CartService, private router:Router , private formbuilder : FormBuilder, private comentservice:ComentService) { 

    this.comentform = this.formbuilder.group({
      content:['', Validators.required],

    })
    this.replyForm = this.formbuilder.group({
      reply:['', Validators.required],
    })
  }

  ngOnInit() {
   

    this.description = true;
    this.route.paramMap.subscribe(params => {
      const idString = params.get('id');
      if (idString !== null) {
        this.id_product = +idString;
        this.comentservice.getAllcoment(this.id_product).subscribe((allcoment: any[]) =>{
          this.allcoment = allcoment;
          // console.log(this.allcoment);
          this.tinhsaosp(allcoment);
        })
        const id = +idString;
        // console.log('ID:', id); 
        this.kiemsoluong(id)
        const id_user = localStorage.getItem('id_user');
        this.cart = JSON.parse(localStorage.getItem('cart') || '[]'); // Lấy giỏ hàng từ localStorage
    
        const existingProductIndex = this.cart.findIndex(item => item.id_product === id);
        if (existingProductIndex !== -1) { // Nếu sản phẩm đã tồn tại trong giỏ hàng
          this.soluong = this.cart[existingProductIndex].quantity
      } else { // Nếu sản phẩm chưa tồn tại trong giỏ hàng
         
      }
        this.http.get<Product[]>(`http://localhost:3000/product/${id}`)
          .subscribe((data: Product[]) => {
            this.data = data;
          });
      }
      
    });
    // console.log(this.cart);

  }

  closeModal(){
    this.isModalOpen = false;
  }
  tinhsaosp(allcoment:any){
    // console.log(allcoment);
    let tongsao:number =0;
    for(let i =0;i<allcoment.length;i++){
      tongsao += allcoment[i].star
  }
    // console.log(tongsao);
    let objdanhgia ={};
    objdanhgia ={sosao:tongsao/allcoment.length, soluot:allcoment.length}
  this.saosp = objdanhgia;
  }

  getCurrentTime(): void {
    const now = new Date();
    
    const year = now.getFullYear();
    const month = (now.getMonth() + 1).toString().padStart(2, '0'); // Tháng từ 0-11, nên cần +1
    const day = now.getDate().toString().padStart(2, '0');
    
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const seconds = now.getSeconds().toString().padStart(2, '0');
  
    this.currentTime = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  }



  kiemsoluong(id:number){
    const id_user = localStorage.getItem('id_user');
    let cart: Cart[] = JSON.parse(localStorage.getItem('cart') || '[]'); // Lấy giỏ hàng từ localStorage

    const existingProductIndex = cart.findIndex(item => item.id_product === id);
     // Tìm kiếm sản phẩm trong giỏ hàng

     if (existingProductIndex !== -1) { // Nếu sản phẩm đã tồn tại trong giỏ hàng
      this.soluong = cart[existingProductIndex].quantity;
  } else { // Nếu sản phẩm chưa tồn tại trong giỏ hàng
      this.soluong = 1;
  }
  }
  comentevent(page:any){
    this.trangcmtdangxem = page;
    this.ngOnInit()
    this.description = false;
  this.coment = true;
  let objidandpage ={}
  objidandpage ={id_product:this.id_product, page:page}
  let arr:any[]=[]
  // console.log(this.id_product);
  this.comentservice.getAllcoments(objidandpage).subscribe((allcoment: any[]) =>{
    this.allcoment = allcoment;
    let tongcmt = allcoment.length/10;
    // console.log(tongcmt)
    let roundedNum1 = Math.ceil(tongcmt);
    // console.log(roundedNum1);
    for (let i = 1; i <= roundedNum1; i++) {
      this.sobutton =[];
      // console.log(i);
      this.sobutton.push(i);
    }
    // console.log(this.sobutton);
    // console.log(this.allcoment);
    let aridcmt:any[]=[]
    this.allcoment.forEach((id_user:any) =>{
      arr.push(id_user.id_user);
      aridcmt.push(id_user.id)
    })
   
    let arrid_usser = Array.from(new Set(arr));
    this.arridcoment =  Array.from(new Set(aridcmt));
    // console.log(this.arridcoment);

    let objidcmt ={}
    let aridcmts=[];
    for(let i=0;i<this.arridcoment.length;i++){
      objidcmt ={id:this.arridcoment[i]}
      aridcmts.push(objidcmt);
    }
    // console.log(arrid_usser);
    // this.laylikecmt(aridcmts)
    // this.layreplaycmt(aridcmts)
    this.layuser(arrid_usser,allcoment,aridcmts)
   })



  }
layreplaycmt(aridcmts:any,arrussers:any,allcoment:any){
  this.comentservice.layreplaycmttheomangid(aridcmts).subscribe((allreplay: any) =>{
    let ok = allreplay.data.flat()
    // console.log(ok)
    this.laylikecmt(aridcmts, ok,arrussers,allcoment)
  })
// console.log(arridcoment)

}
laylikecmt(aridcmts:any, replaycmt:any, arrussers:any,allcoment:any){
  // console.log(arridcoment)
  this.comentservice.laycmtmangid(aridcmts).subscribe((alllike: any) =>{
    // console.log(alllike);
    
    let ok = alllike.data.flat()
    // console.log(ok);

this.nhomuser(arrussers,allcoment,ok,replaycmt,)

    
    // let like = ok.filter((item:any) => item.status ==1)
    // let dislike = ok.filter((item:any) => item.status ==2)
    // let objlike = {}
    // objlike ={id_coment:like,like:like.length,dislike:dislike.length}
    // console.log(objlike);

    
  })
}

  layuser(arrid_usser:any, allcoment:any,aridcmts:any){
    let arrid = [];
    let objarrid ={};
    for(let i = 0; i< arrid_usser.length; i++){
      objarrid = {id : arrid_usser[i]}
      arrid.push(objarrid);
    }
    // console.log(arrid);
    this.userservice.layusertheomangid(arrid).subscribe((arrusser:any) =>{
      this.arruser = arrusser;
      const arrussers = this.arruser.data.flat();
      // console.log(arrussers);
      // this.layreplaycmt(arrussers)
      this.layreplaycmt(aridcmts,arrussers,allcoment)
      // this.nhomuser(arrussers,allcoment)
    })
  }
  nhomuser(arrussers: any, allcoment: any, ok:any,replaycmt:any) {
    let objcmt = {};
    let arallcmt =[];
    for (let i = 0; i < allcoment.length; i++) {
      if (allcoment[i] && allcoment[i].id_user) { // allcoment = [{id:1,id_user:3, content:áodk}, {id:2,id_user:4, content:áodk},{id:3,id_user:5, content:áodk}}]
        for (let j = 0; j < arrussers.length; j++) { //arruser = [{id_user:1, name:ok},{id_user:4, name:ok},{id_user:5, name:ok}]
          if (allcoment[i].id_user == arrussers[j].id_user) {
            objcmt = {
              idkhichualike:0,
              id_usercmt:allcoment[i].id_user,
              id_coment:allcoment[i].id,
              id_user:arrussers[j].id_user,
              name: arrussers[j].namereal,
              image_user: arrussers[j].image,
              date: allcoment[i].date,
              image: allcoment[i].image,
              content: allcoment[i].content,
              star: allcoment[i].star
            };
            arallcmt.push(objcmt);

          }

        }
      }
    }
    let id_user = localStorage.getItem('id_user');
    console.log(id_user);
    const result: Comment[] = arallcmt.map((cmt:any) => ({
      id_userreal:id_user ? Number(id_user) : null,
      id_usercmt:cmt.id_usercmt,
      id_coment: cmt.id_coment,
      content: cmt.content,
      like: 0,
      dislike: 0,
      replaycoment: 0,
      name:cmt.name,
      date:cmt.date,
      image:cmt.image,
      id_replay:cmt.idkhichualike,
      star:cmt.star,
      id_likecoment:cmt.idkhichualike,
      id_userlike:[],
      id_userdislike:[],
      img_user:cmt.img_user
    }));

    ok.forEach((like:any) => {
      // console.log(like);
      const target = result.find((cmt:any) => cmt.id_coment === like.id_coment);
      if (target) {
        if (like.status === 1) {
          target.like++;
          target.id_userlike.push(like.id_user);
          target.id_likecoment = like.id_likecoment;
        } else if (like.status === 2) {
          target.id_userdislike.push(like.id_user);
          target.id_likecoment = like.id_likecoment;
          target.dislike++;
        }
      }
    });

    replaycmt.forEach((reply:any) => {
      const target = result.find((cmt:any) => cmt.id_coment === reply.id_coment);
      if (target) {
        target.replaycoment++;
        target.id_replay = reply.id_replaycoment;
      }
    });
    this.cmthoanchinh =result;

console.log(result);



    
    // console.log(arallcmt);
    // console.log(ok);
    // console.log(replaycmt);
    // console.log(this.cmthoanchinh);
    // console.log(this.allcoment);
    // console.log(arrussers);
  }
  

onClickstar(index:number){
  this.stars = this.stars.map((star, i) => i <= index);
  // console.log(this.stars);
}

  descriptionevent(){
    this.description =true;
    this.coment = false;

  }
like(id:any){
  // this.cmthoanchinh = []
  let id_user = localStorage.getItem('id_user');

  // console.log('đã like' + id)
  let obj ={id_user:id_user,id_coment:id};
  this.comentservice.likecmt(obj).subscribe((data) => {
    this.comentevent(this.trangcmtdangxem);
  })


}
dislikecmt(id:any){
  // console.log('đã dislike' + id)
  let id_user = localStorage.getItem('id_user');

  // console.log('đã like' + id)
  let obj ={id_user:id_user,id_coment:id};
  this.comentservice.dislikecmt(obj).subscribe((data) => {
    this.comentevent(this.trangcmtdangxem);
  })
}

huylike(id:any){
  let id_user = localStorage.getItem('id_user');

  // console.log('đã like' + id)
  let obj ={id_user:id_user,id_likecoment:id};
  this.comentservice.huylikecmt(obj).subscribe((data) => {
    this.comentevent(this.trangcmtdangxem);
  })
}
huydislikecmt(id:any){
  let id_user = localStorage.getItem('id_user');

  // console.log('đã like' + id)
  let obj ={id_user:id_user,id_dislikecoment:id};
  this.comentservice.huydislikecmt(obj).subscribe((data) => {
    this.comentevent(this.trangcmtdangxem);
  })
}

xoacmt(id:any){
  const confirmed = window.confirm('Bạn có chắc muốn xóa bình luận');
  if(confirmed){
    this.deletecmt(id)
  }

}
deletecmt(id:any){
  this.comentservice.deletecmt(id).subscribe((data) => {
    this.comentevent(this.trangcmtdangxem);
  })
}
taophanhoi(id:any){
  this.isModalOpen = true;
  this.id_comentdephanhoi = id;
}
onSubmitreply(){
  this.getCurrentTime();

    console.log(this.id_comentdephanhoi);
    let id_user = localStorage.getItem('id_user');
  if(id_user){
    let formdata = new FormData

    formdata.append('content',this.replyForm.get('reply')?.value);
    formdata.append('id_user', id_user)
    formdata.append('id_coment', this.id_comentdephanhoi);
    formdata.append('date', this.currentTime);
    this.comentservice.addreplycoment(formdata).subscribe(data => {
      console.log(data);
      this.isModalOpen = false;

      this.comentevent(this.trangcmtdangxem)
    });

  }
}

xemphanhoi(id: any) {
  this.comentservice.layreplay(id).subscribe((data) => {
    this.replayComments[id] = data;
    console.log(data)
    const user = this.replayComments[id].map((user: any) => user.id_user_replay);
    let arruser = user.map((id: any) => ({ id }));
    this.layusserreplay(arruser, id);
  });
}
xoaphanhoi(id:any, id_coment:any){
  console.log(id);
  const confirmed = window.confirm('Bạn có chắc muốn xóa bình luận');
  if(confirmed){
    this.deletereply(id,id_coment)
  }

}
deletereply(id:any,id_coment:any){
  this.comentservice.deletereply(id).subscribe((data) => {
    // this.ngOnInit()
    this.replayComments[id_coment] = [];
    this.comentevent(this.trangcmtdangxem);
  })
}
dongreply(id:any){
  this.replayComments[id] = [];

}

layusserreplay(arriduser: any, idcoment: any) {
  this.userservice.layusertheomangid(arriduser).subscribe((arrusser: any) => {
    let arrusserreplay = arrusser.data.flat();
    console.log(arrusserreplay)
    let objreplay = {};
    let arreplay = this.replayComments[idcoment].map((replay: any) => {
      let user = arrusserreplay.find((u: any) => u.id_user === replay.id_user_replay);
      return {
        id_replaycmt:replay.id_replaycoment,
        id_userreply:user.id_user,
        name: user.namereal,
        content: replay.content,
        date: replay.date,
        image_user: user.image,
        id_coment: replay.id_coment,
      };
    });
    this.replayComments[idcoment] = arreplay;
  });
}


  addcart(id_product: number, thanhtien:number, name:string, soluong:number, image:string, id_seller:number) { // Click để thêm sản phẩm vào giỏ hàng
  //  console.log(this.cart)
  //  console.log(thanhtien);
   this.id_seller = id_seller;
   this.showDetails = true;
   this.nameproduct = name;
   this.price = thanhtien;
   this.soluongs = soluong;
   this.imgae_product = image;
   let date = new Date();
  //  console.log(date);

   let id_user = localStorage.getItem('id_user');
   if(!id_user){
    alert("bạn chưa đăng nhập, hãy đăng nhập");
    this.router.navigate(['login'])
   }else{
   this.datacart = {'id_user':id_user, 'id_product' : id_product, 'quantity': soluong, 'total_amount': thanhtien, 'pay' : 0, 'date':date, 'id_seller':id_seller}
   }
   
      //  localStorage.setItem('cart', JSON.stringify(this.cart)); // Lưu lại giỏ hàng vào localStorage

}

plus(id_product:number){

  const id_user = localStorage.getItem('id_user');
  if(!id_user){
    alert("bạn chưa đăng nhập, hãy đăng nhập");
    this.router.navigate(['login'])

  }

    const existingProductIndex = this.cart.findIndex(item => item.id_product === id_product); // Tìm kiếm sản phẩm trong giỏ hàng

    if (existingProductIndex !== -1) { // Nếu sản phẩm đã tồn tại trong giỏ hàng
        this.cart[existingProductIndex].quantity += 1; // Tăng số lượng sản phẩm
        this.soluong = this.cart[existingProductIndex].quantity
    } else { // Nếu sản phẩm chưa tồn tại trong giỏ hàng
        const newCartItem: Cart = { id_user: +id_user!, id_product: id_product, quantity: 1}; // Tạo một sản phẩm mới
        this.cart.push(newCartItem); // Thêm sản phẩm mới vào giỏ hàng
    }

    // localStorage.setItem('cart', JSON.stringify(cart)); // Lưu lại giỏ hàng vào localStorage
// console.log(this.cart);
    const cartss = localStorage.getItem("cart");
    // console.log(cartss)

}  
delete(id_product:number){
  // let cart: Cart[] = JSON.parse(localStorage.getItem('cart') || '[]'); // Lấy giỏ hàng từ localStorage

  // const deletecart = cart.filter(item => item.id_product !== id_product)
  // localStorage.setItem('cart', JSON.stringify(deletecart)); // Lưu lại giỏ hàng vào localStorage
  // this.plus(id_product);

}
mins(id_product:number){
  const existingProductIndex = this.cart.findIndex(item => item.id_product === id_product); // Tìm kiếm sản phẩm trong giỏ hàng

  if (existingProductIndex !== -1) { // Nếu sản phẩm đã tồn tại trong giỏ hàng
   

    if(this.cart[existingProductIndex].quantity  ==1){
      return;

    }else{
      this.cart[existingProductIndex].quantity -= 1; 
      this.soluong = this.cart[existingProductIndex].quantity
    }
    // Tăng số lượng sản phẩm
  } else { // Nếu sản phẩm chưa tồn tại trong giỏ hàng
   
}

// localStorage.setItem('cart', JSON.stringify(cart)); // Lưu lại giỏ hàng vào localStorage
const cartss = localStorage.getItem("cart");
// console.log(cartss)


}


addsubmit(){
  // console.log(this.datacart);
  this.cartadd.addcart(this.datacart).subscribe((data) => {
    if(data.thongbao == true){
      localStorage.removeItem('cart');
      alert('đã thêm vào giỏ hàng');
      this.cancelsubmut();
    }else{
      alert("lỗi");
    }
  });
  // console.log(this.cart);
  // localStorage.setItem('cart', JSON.stringify(this.cart)); // Lưu lại giỏ hàng vào localStorage
  // alert("thêm vào giỏ hàng thành công");
  // this.cartadd.addcart(this.cart).subscribe((data: Cart[]) => {
  //   // this.data = data;
  // });
  this.cancelsubmut();

}

cancelsubmut(){
  this.showDetails = false;

}
onFileChange(event: any) {
  const file = event.target.files[0];
  if (file) {
    this.selectedFile = file;
  }
}
onSubmitaddcoment(){
  this.getCurrentTime();
  const sosao = this.stars.filter((item:boolean) => item == true)
  // console.log("khi đã thêm sao" + sosao.length);
  const id_user = localStorage.getItem('id_user');
  // console.log(id_user);
  // console.log(this.id_product);
  // console.log(this.comentform.get('content')?.value);
  if(id_user && this.id_product){
  const formdata = new FormData();
  formdata.append('content', this.comentform.get('content')?.value);
  formdata.append('star',sosao.length.toString() );
  formdata.append('id_user', id_user);
  formdata.append('id_product', this.id_product.toString());
  formdata.append('date', this.currentTime);
  if(!this.selectedFile){
    this.selectedFile = '';
  }
  formdata.append('file', this.selectedFile);
  this.comentservice.addcoment(formdata).subscribe(data => {
    // console.log(data);
    this.comentevent(this.trangcmtdangxem)
  });
  }
 
  

}

}
