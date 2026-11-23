
import React, { useMemo, useState } from "react";
import {
  SafeAreaView, View, Text, TextInput, ScrollView,
  Pressable, StyleSheet, StatusBar, Alert
} from "react-native";

const GREEN = "#087A45";
const DARK = "#14532D";
const BG = "#F4F7F5";
const WHITE = "#FFFFFF";

const markets = [
  "Burundi","Rwanda","République démocratique du Congo","Kenya","Tanzanie",
  "Ouganda","Éthiopie","Somalie","Soudan du Sud","Djibouti","Érythrée",
  "Afrique du Sud","Namibie","Botswana","Zimbabwe","Zambie","Malawi",
  "Mozambique","Angola","Lesotho","Eswatini","Madagascar","Maurice",
  "Seychelles","Comores","Nigeria","Ghana","Côte d’Ivoire","Sénégal",
  "Mali","Burkina Faso","Niger","Bénin","Togo","Guinée","Guinée-Bissau",
  "Sierra Leone","Liberia","Gambie","Cameroun","Gabon","Congo","Tchad",
  "République centrafricaine","Guinée équatoriale","Maroc","Algérie",
  "Tunisie","Libye","Égypte","Mauritanie","Cap-Vert"
];

const originalActions = [
  { icon:"🛍️", title:"Acheter", subtitle:"Découvrir les produits" },
  { icon:"🏪", title:"Vendre", subtitle:"Présenter ma boutique" },
  { icon:"🚚", title:"Livraison", subtitle:"Suivre une commande" }
];

const seedProducts = [
  {id:1,name:"Smartphone Android",shop:"Tech Burundi",province:"Bujumbura",category:"Électronique",price:450000,currency:"BIF",emoji:"📱",description:"Téléphone mobile."},
  {id:2,name:"Chaussures classiques",shop:"Urunani Fashion",province:"Gitega",category:"Mode",price:65000,currency:"BIF",emoji:"👞",description:"Chaussures élégantes."},
  {id:3,name:"Fauteuil moderne",shop:"Maison Plus",province:"Bujumbura",category:"Maison",price:280000,currency:"BIF",emoji:"🪑",description:"Fauteuil pour la maison."},
  {id:4,name:"Panier de fruits",shop:"Isoko Fresh",province:"Ngozi",category:"Alimentation",price:25000,currency:"BIF",emoji:"🍍",description:"Produits frais."},
  {id:5,name:"Kit de soins",shop:"Belle Vie",province:"Muyinga",category:"Beauté",price:38000,currency:"BIF",emoji:"🧴",description:"Kit de soins."},
  {id:6,name:"Casque audio",shop:"Tech Burundi",province:"Bujumbura",category:"Électronique",price:85000,currency:"BIF",emoji:"🎧",description:"Casque audio."},
  {id:7,name:"Sac à main",shop:"Urunani Fashion",province:"Bururi",category:"Mode",price:52000,currency:"BIF",emoji:"👜",description:"Sac à main."},
  {id:8,name:"Lampe de bureau",shop:"Maison Plus",province:"Gitega",category:"Maison",price:42000,currency:"BIF",emoji:"💡",description:"Lampe de bureau."}
];

const money = n => Number(n||0).toLocaleString("fr-FR")+" BIF";

export default function App() {
  const [selectedMarket,setSelectedMarket] = useState("Burundi");
  const [marketSearch,setMarketSearch] = useState("");
  const [screen,setScreen] = useState("welcome");
  const [authMode,setAuthMode] = useState("signup");
  const [role,setRole] = useState("");
  const [name,setName] = useState("");
  const [email,setEmail] = useState("");
  const [password,setPassword] = useState("");
  const [search,setSearch] = useState("");
  const [category,setCategory] = useState("Tout");
  const [tab,setTab] = useState("Accueil");
  const [products,setProducts] = useState(seedProducts);
  const [favorites,setFavorites] = useState([]);
  const [cart,setCart] = useState([]);
  const [orders,setOrders] = useState([]);
  const [selectedProduct,setSelectedProduct] = useState(null);
  const [storeName,setStoreName] = useState("");
  const [productName,setProductName] = useState("");
  const [productPrice,setProductPrice] = useState("");
  const [productDescription,setProductDescription] = useState("");
  const [productEmoji,setProductEmoji] = useState("📦");
  const [tracking,setTracking] = useState("");

  const filteredMarkets = useMemo(
    ()=>markets.filter(m=>m.toLowerCase().includes(marketSearch.toLowerCase())),
    [marketSearch]
  );

  const filteredProducts = useMemo(
    ()=>products.filter(p=>
      (category==="Tout" || p.category===category) &&
      [p.name,p.shop,p.category,p.province].join(" ").toLowerCase().includes(search.toLowerCase())
    ),
    [products,category,search]
  );

  const cartTotal = cart.reduce((n,p)=>n+p.price*p.qty,0);

  const openAuth = (mode, action) => {
    setAuthMode(mode);
    setScreen("auth");
    setPendingAction(action);
  };

  const [pendingAction,setPendingAction] = useState("Acheter");

  const continueAuth = () => {
    if (!email.trim() || !password.trim() || (authMode==="signup"&&!name.trim())) {
      Alert.alert("SokoLink","Remplis les champs obligatoires.");
      return;
    }
    if (authMode==="signup") {
      setScreen("role");
    } else {
      if (!role) {
        setScreen("role");
        return;
      }
      enterApp(pendingAction);
    }
  };

  const enterApp = action => {
    setScreen("marketplace");
    setTab(action==="Vendre"&&role==="Vendeur"?"Vendre":
      action==="Livraison"?"Livraison":"Accueil");
  };

  const selectRole = selected => {
    setRole(selected);
    enterApp(pendingAction);
  };

  const goTab = t => {
    setSelectedProduct(null);
    setTab(t);
    setScreen("marketplace");
  };

  const toggleFavorite = id => {
    setFavorites(old=>old.includes(id)?old.filter(x=>x!==id):[...old,id]);
  };

  const addCart = product => {
    setCart(old=>{
      const found=old.find(p=>p.id===product.id);
      if(found) return old.map(p=>p.id===product.id?{...p,qty:p.qty+1}:p);
      return [...old,{...product,qty:1}];
    });
    Alert.alert("Panier","Produit ajouté au panier.");
  };

  const removeCart = id => setCart(old=>old.filter(p=>p.id!==id));

  const publish = () => {
    if(!productName.trim()||!productPrice||Number(productPrice)<=0){
      Alert.alert("Produit","Saisis le nom et un prix valide.");
      return;
    }
    const p={
      id:Date.now(),name:productName,shop:storeName||name||"Ma boutique",
      province:selectedMarket,category:"Autres",price:Number(productPrice),
      currency:"BIF",emoji:productEmoji||"📦",description:productDescription
    };
    setProducts(old=>[p,...old]);
    setProductName("");setProductPrice("");setProductDescription("");
    setProductEmoji("📦");
    Alert.alert("SokoLink","Produit publié dans le catalogue !");
  };

  const checkout = () => {
    if(!cart.length){
      Alert.alert("Panier","Ton panier est vide.");
      return;
    }
    const order={
      id:"SL-"+Date.now().toString().slice(-7),
      items:[...cart],total:cartTotal,status:"Commande reçue",
      date:new Date().toLocaleDateString("fr-FR")
    };
    setOrders(old=>[order,...old]);
    setCart([]);
    Alert.alert("Commande", "Commande de démonstration créée.");
    goTab("Livraison");
  };

  const Btn = ({title,onPress,color=GREEN}) => (
    <Pressable onPress={onPress} style={[s.btn,{backgroundColor:color}]}>
      <Text style={s.btnText}>{title}</Text>
    </Pressable>
  );

  const Input = ({label,value,onChange,placeholder,keyboard,secure}) => (
    <View style={{marginBottom:10}}>
      {label && <Text style={s.inputLabel}>{label}</Text>}
      <TextInput
        style={s.input}
        value={value}
        onChangeText={onChange}
        placeholder={placeholder||label}
        placeholderTextColor="#87938C"
        keyboardType={keyboard||"default"}
        secureTextEntry={secure}
      />
    </View>
  );

  const ProductCard = ({p}) => (
    <Pressable onPress={()=>setSelectedProduct(p)} style={s.product}>
      <View style={s.productPhoto}>
        <Text style={{fontSize:48}}>{p.emoji}</Text>
        <Pressable style={s.heart} onPress={()=>toggleFavorite(p.id)}>
          <Text style={{fontSize:21}}>{favorites.includes(p.id)?"❤️":"♡"}</Text>
        </Pressable>
      </View>
      <Text style={s.productName}>{p.name}</Text>
      <Text style={s.shopName}>{p.shop} · {p.province}</Text>
      <Text style={s.price}>{money(p.price)}</Text>
      <Pressable style={s.addButton} onPress={()=>addCart(p)}>
        <Text style={s.addText}>Ajouter +</Text>
      </Pressable>
    </Pressable>
  );

  // ACCUEIL ORIGINAL - présentation conservée
  const OriginalHome = () => (
    <>
      <View style={s.header}>
        <View style={s.brandRow}>
          <View style={s.logo}><Text style={s.logoText}>S</Text></View>
          <View>
            <Text style={s.brand}>SokoLink</Text>
            <Text style={s.tagline}>Le marché africain, connecté.</Text>
          </View>
        </View>
        <Text style={s.headerNote}>Bienvenue sur SokoLink</Text>
        <Text style={s.headerTitle}>Achetez et vendez à travers l’Afrique.</Text>
      </View>

      <View style={s.section}>
        <Text style={s.sectionTitle}>Votre marché</Text>
        <Text style={s.muted}>Choisissez le pays dans lequel vous souhaitez naviguer.</Text>
        <TextInput
          value={marketSearch}
          onChangeText={setMarketSearch}
          placeholder="Rechercher un pays..."
          placeholderTextColor="#87938C"
          style={s.search}
        />
        <View style={s.marketList}>
          {filteredMarkets.slice(0,8).map(m=>(
            <Pressable key={m} onPress={()=>setSelectedMarket(m)}
              style={[s.marketChip,selectedMarket===m&&s.marketChipActive]}>
              <Text style={[s.marketText,selectedMarket===m&&s.marketTextActive]}>{m}</Text>
            </Pressable>
          ))}
        </View>
        <Text style={s.selected}>Marché sélectionné : {selectedMarket}</Text>
      </View>

      <View style={s.section}>
        <Text style={s.sectionTitle}>Que souhaitez-vous faire ?</Text>
        {originalActions.map(item=>(
          <Pressable key={item.title} style={s.actionCard}
            onPress={()=>openAuth("login",item.title)}>
            <Text style={s.actionIcon}>{item.icon}</Text>
            <View style={{flex:1}}>
              <Text style={s.actionTitle}>{item.title}</Text>
              <Text style={s.muted}>{item.subtitle}</Text>
            </View>
            <Text style={s.chevron}>›</Text>
          </Pressable>
        ))}
      </View>

      <View style={s.footer}>
        <Text style={s.footerBrand}>SokoLink</Text>
        <Text style={s.footerText}>Une plateforme. Plusieurs marchés. Toute l’Afrique.</Text>
        <Text style={s.footerText}>Version de démonstration</Text>
      </View>
    </>
  );

  // BARRE DE NAVIGATION MARKETPLACE
  const BottomNav = () => {
    const items=[
      ["Accueil","⌂"],["Explorer","⌕"],["Favoris","♡"],
      ["Messages","✉"],["Compte","◉"]
    ];
    return (
      <View style={s.bottomNav}>
        {items.map(([t,icon])=>(
          <Pressable key={t} style={s.navItem} onPress={()=>goTab(t)}>
            <Text style={{fontSize:22,color:tab===t?GREEN:"#89928C"}}>{icon}</Text>
            <Text style={{fontSize:10,color:tab===t?GREEN:"#89928C"}}>{t}</Text>
          </Pressable>
        ))}
      </View>
    );
  };

  const MarketplaceHeader = () => (
    <View style={s.marketHeader}>
      <View style={s.headerTop}>
        <View>
          <Text style={s.marketLogo}>SokoLink</Text>
          <Text style={s.marketWelcome}>Bonjour {name||"👋"}</Text>
        </View>
        <Pressable style={s.cartBubble} onPress={()=>goTab("Panier")}>
          <Text>🛒 {cart.reduce((n,p)=>n+p.qty,0)}</Text>
        </Pressable>
      </View>
      <Text style={s.marketSubtitle}>📍 {selectedMarket}</Text>
      <TextInput value={search} onChangeText={setSearch}
        style={s.search} placeholder="Rechercher un produit..."
        placeholderTextColor="#87938C"/>
    </View>
  );

  return (
    <SafeAreaView style={s.safe}>
      <StatusBar backgroundColor={GREEN} barStyle="light-content"/>
      <ScrollView contentContainerStyle={s.container} keyboardShouldPersistTaps="handled">

        {/* ACCUEIL EXISTANT */}
        {screen==="welcome" && <OriginalHome/>}

        {/* AUTHENTIFICATION */}
        {screen==="auth" && <>
          <Text style={s.title}>{authMode==="signup"?"Créer un compte":"Se connecter"}</Text>
          {authMode==="signup" && <Input label="Nom complet" value={name} onChange={setName}/>}
          <Input label="Email ou téléphone" value={email} onChange={setEmail}/>
          <Input label="Mot de passe" value={password} onChange={setPassword} secure/>
          <Text style={s.muted}>Marché : {selectedMarket}</Text>
          <Btn title="Continuer" onPress={continueAuth}/>
          <Btn title="Retour à l'accueil" color="#777" onPress={()=>setScreen("welcome")}/>
          <Pressable onPress={()=>{setAuthMode(authMode==="signup"?"login":"signup");setRole("");}}>
            <Text style={s.link}>{authMode==="signup"?"Déjà un compte ? Se connecter":"Créer un compte"}</Text>
          </Pressable>
        </>}

        {/* CHOIX DU PROFIL APRES AUTH */}
        {screen==="role" && <>
          <Text style={s.title}>Choisir mon profil</Text>
          <Text style={s.muted}>Comment souhaites-tu utiliser SokoLink ?</Text>
          <Pressable style={s.roleCard} onPress={()=>selectRole("Acheteur")}>
            <Text style={{fontSize:32}}>🛒</Text>
            <Text style={s.actionTitle}>Acheteur</Text>
            <Text style={s.muted}>Acheter des produits et suivre mes commandes.</Text>
          </Pressable>
          <Pressable style={s.roleCard} onPress={()=>selectRole("Vendeur")}>
            <Text style={{fontSize:32}}>🏪</Text>
            <Text style={s.actionTitle}>Vendeur</Text>
            <Text style={s.muted}>Vendre mes produits et aussi acheter.</Text>
          </Pressable>
        </>}

        {/* MARKETPLACE */}
        {screen==="marketplace" && <>
          <MarketplaceHeader/>

          {tab==="Accueil" && <>
            <Text style={s.sectionTitle}>Catégories</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {["Tout","Mode","Électronique","Maison","Beauté","Alimentation","Autres"].map(c=>(
                <Pressable key={c} style={s.categoryChip} onPress={()=>{setCategory(c);goTab("Explorer");}}>
                  <Text style={s.categoryText}>{c}</Text>
                </Pressable>
              ))}
            </ScrollView>
            <Text style={s.sectionTitle}>Produits populaires</Text>
            <View style={s.grid}>
              {filteredProducts.map(p=><ProductCard key={p.id} p={p}/>)}
            </View>
          </>}

          {tab==="Explorer" && <>
            <Text style={s.sectionTitle}>Explorer les produits</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {["Tout","Mode","Électronique","Maison","Beauté","Alimentation","Autres"].map(c=>(
                <Pressable key={c} style={[s.categoryChip,category===c&&s.activeChip]} onPress={()=>setCategory(c)}>
                  <Text style={s.categoryText}>{c}</Text>
                </Pressable>
              ))}
            </ScrollView>
            <View style={s.grid}>
              {filteredProducts.map(p=><ProductCard key={p.id} p={p}/>)}
            </View>
          </>}

          {tab==="Favoris" && <>
            <Text style={s.sectionTitle}>Mes favoris ❤️</Text>
            <View style={s.grid}>
              {products.filter(p=>favorites.includes(p.id)).map(p=><ProductCard key={p.id} p={p}/>)}
            </View>
            {!favorites.length&&<Text style={s.muted}>Aucun favori pour le moment.</Text>}
          </>}

          {tab==="Messages" && <>
            <Text style={s.sectionTitle}>Messages</Text>
            <View style={s.emptyCard}>
              <Text style={{fontSize:36}}>💬</Text>
              <Text style={s.actionTitle}>Messagerie de démonstration</Text>
              <Text style={s.muted}>La messagerie vendeur-acheteur sera connectée dans une prochaine version.</Text>
            </View>
          </>}

          {tab==="Compte" && <>
            <Text style={s.sectionTitle}>Mon compte</Text>
            <View style={s.emptyCard}>
              <Text style={{fontSize:38}}>👤</Text>
              <Text style={s.actionTitle}>{name||"Utilisateur"}</Text>
              <Text style={s.muted}>{email}</Text>
              <Text style={s.selected}>Profil : {role}</Text>
              <Text style={s.selected}>Marché : {selectedMarket}</Text>
            </View>
            {role==="Vendeur"&&<Btn title="🏪 Ma boutique / Vendre" onPress={()=>goTab("Vendre")}/>}
            <Btn title="🛒 Mon panier" onPress={()=>goTab("Panier")}/>
            <Btn title="🚚 Mes commandes" onPress={()=>goTab("Livraison")}/>
            <Btn title="Déconnexion" color="#777" onPress={()=>{setRole("");setName("");setEmail("");setPassword("");setScreen("welcome");}}/>
          </>}

          {/* DETAIL PRODUIT */}
          {selectedProduct && <>
            <View style={s.detailCard}>
              <Text style={s.detailEmoji}>{selectedProduct.emoji}</Text>
              <Text style={s.title}>{selectedProduct.name}</Text>
              <Text style={s.price}>{money(selectedProduct.price)}</Text>
              <Text>{selectedProduct.description}</Text>
              <Text style={s.muted}>{selectedProduct.shop} · {selectedProduct.province}</Text>
              <Btn title="Ajouter au panier" onPress={()=>addCart(selectedProduct)}/>
              <Btn title={favorites.includes(selectedProduct.id)?"Retirer des favoris":"Ajouter aux favoris"} color={DARK} onPress={()=>toggleFavorite(selectedProduct.id)}/>
              <Btn title="Fermer" color="#777" onPress={()=>setSelectedProduct(null)}/>
            </View>
          </>}

          {/* VENDRE */}
          {tab==="Vendre" && role==="Vendeur" && <>
            <Text style={s.title}>Ma boutique</Text>
            <Input label="Nom de boutique" value={storeName} onChange={setStoreName}/>
            <Text style={s.sectionTitle}>Publier un produit</Text>
            <Input label="Nom du produit" value={productName} onChange={setProductName}/>
            <Input label="Prix (BIF)" value={productPrice} onChange={setProductPrice} keyboard="numeric"/>
            <Input label="Emoji (photo temporaire)" value={productEmoji} onChange={setProductEmoji}/>
            <Input label="Description" value={productDescription} onChange={setProductDescription}/>
            <Btn title="Publier" onPress={publish}/>
            <Text style={s.sectionTitle}>Produits de ma boutique</Text>
            {products.filter(p=>p.shop===(storeName||name)).map(p=>(
              <View key={p.id} style={s.orderCard}>
                <Text>{p.emoji} {p.name}</Text>
                <Text style={s.price}>{money(p.price)}</Text>
              </View>
            ))}
          </>}

          {/* PANIER */}
          {tab==="Panier" && <>
            <Text style={s.title}>Mon panier</Text>
            {cart.map(p=>(
              <View key={p.id} style={s.orderCard}>
                <Text>{p.emoji} {p.name} × {p.qty}</Text>
                <Text style={s.price}>{money(p.price*p.qty)}</Text>
                <Pressable onPress={()=>removeCart(p.id)}>
                  <Text style={{color:"#B3261E"}}>Retirer</Text>
                </Pressable>
              </View>
            ))}
            {!cart.length&&<Text style={s.muted}>Ton panier est vide.</Text>}
            <Text style={s.total}>Total : {money(cartTotal)}</Text>
            <Btn title="Confirmer ma commande" onPress={checkout}/>
          </>}

          {/* LIVRAISON */}
          {tab==="Livraison" && <>
            <Text style={s.title}>Livraison et commandes</Text>
            <Input label="Numéro de commande" value={tracking} onChange={setTracking} placeholder="SL-..."/>
            {orders.filter(o=>!tracking||o.id.toLowerCase().includes(tracking.toLowerCase())).map(o=>(
              <View key={o.id} style={s.orderCard}>
                <Text style={s.actionTitle}>Commande {o.id}</Text>
                <Text>{o.date}</Text>
                <Text>{o.items.length} produit(s)</Text>
                <Text style={s.price}>{money(o.total)}</Text>
                <Text>📦 {o.status}</Text>
                <Text>🛵 Préparation</Text>
                <Text>🚚 En livraison</Text>
                <Text>✅ Livrée (simulation)</Text>
              </View>
            ))}
            {!orders.length&&<Text style={s.muted}>Aucune commande pour le moment.</Text>}
          </>}
        </>}

      </ScrollView>

      {screen==="marketplace" && <BottomNav/>}
    </SafeAreaView>
  );
}

const s=StyleSheet.create({
  safe:{flex:1,backgroundColor:BG},
  container:{paddingBottom:24},
  header:{backgroundColor:GREEN,paddingHorizontal:22,paddingTop:22,paddingBottom:30,borderBottomLeftRadius:24,borderBottomRightRadius:24},
  brandRow:{flexDirection:"row",alignItems:"center",gap:12},
  logo:{width:48,height:48,borderRadius:15,backgroundColor:WHITE,alignItems:"center",justifyContent:"center"},
  logoText:{color:GREEN,fontSize:32,fontWeight:"900"},
  brand:{color:WHITE,fontSize:25,fontWeight:"800"},
  tagline:{color:"#D7F0E2",fontSize:12,marginTop:2},
  headerNote:{color:"#D7F0E2",marginTop:28,fontSize:13,fontWeight:"600"},
  headerTitle:{color:WHITE,fontSize:25,fontWeight:"800",lineHeight:32,marginTop:7,maxWidth:320},
  section:{paddingHorizontal:18,paddingTop:24},
  sectionTitle:{fontSize:19,color:"#17251D",fontWeight:"800",marginTop:18,marginBottom:10},
  muted:{color:"#6F7D74",fontSize:13,marginTop:5},
  search:{backgroundColor:WHITE,borderWidth:1,borderColor:"#DFE8E2",borderRadius:12,paddingHorizontal:14,paddingVertical:12,marginTop:14,color:"#17251D"},
  marketList:{flexDirection:"row",flexWrap:"wrap",gap:8,marginTop:12},
  marketChip:{backgroundColor:WHITE,borderColor:"#DFE8E2",borderWidth:1,borderRadius:18,paddingHorizontal:12,paddingVertical:8},
  marketChipActive:{backgroundColor:"#E0F3E8",borderColor:GREEN},
  marketText:{color:"#526158",fontSize:12,fontWeight:"600"},
  marketTextActive:{color:GREEN},
  selected:{color:GREEN,fontSize:12,fontWeight:"700",marginTop:12},
  actionCard:{backgroundColor:WHITE,borderRadius:16,padding:16,marginTop:11,flexDirection:"row",alignItems:"center",borderWidth:1,borderColor:"#E7EEE9"},
  actionIcon:{fontSize:26,width:42},
  actionTitle:{color:"#17251D",fontWeight:"800",fontSize:16},
  chevron:{color:GREEN,fontSize:28,paddingLeft:8},
  footer:{alignItems:"center",paddingHorizontal:24,paddingTop:30},
  footerBrand:{color:GREEN,fontWeight:"900",fontSize:18},
  footerText:{color:"#7B8980",fontSize:11,marginTop:5,textAlign:"center"},
  title:{fontSize:24,fontWeight:"bold",color:GREEN,margin:18},
  input:{backgroundColor:WHITE,borderWidth:1,borderColor:"#D5E3D9",borderRadius:10,padding:13,color:"#222"},
  inputLabel:{color:"#555",marginBottom:5},
  btn:{padding:15,borderRadius:11,alignItems:"center",marginVertical:6,marginHorizontal:18},
  btnText:{color:WHITE,fontWeight:"bold",fontSize:16},
  link:{color:GREEN,textAlign:"center",margin:18,fontWeight:"bold"},
  roleCard:{padding:18,backgroundColor:WHITE,borderWidth:1,borderColor:"#D5E3D9",borderRadius:14,margin:10},
  marketHeader:{backgroundColor:GREEN,borderRadius:16,padding:16,marginBottom:12},
  headerTop:{flexDirection:"row",justifyContent:"space-between",alignItems:"center"},
  marketLogo:{fontSize:22,fontWeight:"900",color:WHITE},
  marketWelcome:{fontSize:20,fontWeight:"bold",color:WHITE,marginTop:6},
  marketSubtitle:{color:"#D7F0E2",marginTop:6},
  cartBubble:{backgroundColor:WHITE,borderRadius:22,padding:10},
  categoryChip:{backgroundColor:"#EAF4EE",paddingHorizontal:14,paddingVertical:10,borderRadius:20,margin:5},
  activeChip:{backgroundColor:"#D0EBDD",borderColor:GREEN,borderWidth:1},
  categoryText:{color:DARK,fontSize:12,fontWeight:"600"},
  grid:{flexDirection:"row",flexWrap:"wrap",justifyContent:"space-between"},
  product:{width:"48%",backgroundColor:WHITE,borderRadius:14,padding:9,marginBottom:12,borderWidth:1,borderColor:"#E0EAE3"},
  productPhoto:{height:120,backgroundColor:"#EAF4EE",borderRadius:10,alignItems:"center",justifyContent:"center",position:"relative"},
  heart:{position:"absolute",right:8,top:8,backgroundColor:WHITE,width:32,height:32,borderRadius:20,alignItems:"center",justifyContent:"center"},
  productName:{fontWeight:"bold",fontSize:14,color:"#183C29",marginTop:8},
  shopName:{fontSize:10,color:"#777",marginTop:3},
  price:{fontWeight:"bold",fontSize:15,color:GREEN,marginVertical:4},
  addButton:{backgroundColor:GREEN,padding:9,borderRadius:8,alignItems:"center",marginTop:7},
  addText:{color:WHITE,fontWeight:"bold",fontSize:12},
  bottomNav:{flexDirection:"row",justifyContent:"space-around",backgroundColor:WHITE,borderTopWidth:1,borderTopColor:"#E0EAE3",paddingVertical:10},
  navItem:{alignItems:"center",minWidth:52},
  detailCard:{backgroundColor:WHITE,borderRadius:14,padding:18,margin:8},
  detailEmoji:{fontSize:90,textAlign:"center",margin:20},
  orderCard:{backgroundColor:WHITE,padding:15,borderRadius:12,marginVertical:8},
  total:{fontSize:20,fontWeight:"bold",color:DARK,margin:12},
  emptyCard:{backgroundColor:WHITE,padding:18,borderRadius:14,marginVertical:10,alignItems:"center"},
});
