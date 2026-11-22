import React, { useMemo, useState } from "react";
import {
  SafeAreaView, View, Text, TextInput, ScrollView, Pressable,
  StyleSheet, StatusBar
} from "react-native";

const markets = [
  "Burundi","Rwanda","République démocratique du Congo","Kenya","Tanzanie",
  "Ouganda","Éthiopie","Somalie","Soudan du Sud","Djibouti","Érythrée",
  "Afrique du Sud","Namibie","Botswana","Zimbabwe","Zambie","Malawi",
  "Mozambique","Angola","Lesotho","Eswatini","Madagascar","Maurice",
  "Seychelles","Comores","Nigeria","Ghana","Côte d’Ivoire","Sénégal",
  "Mali","Burkina Faso","Niger","Bénin","Togo","Guinée","Guinée-Bissau",
  "Sierra Leone","Liberia","Gambie","Cameroun","Gabon","Congo",
  "Tchad","République centrafricaine","Guinée équatoriale","Maroc",
  "Algérie","Tunisie","Libye","Égypte","Mauritanie","Cap-Vert"
];

const categories = [
  { icon: "🛍️", title: "Acheter", subtitle: "Découvrir les produits" },
  { icon: "🏪", title: "Vendre", subtitle: "Présenter ma boutique" },
  { icon: "🚚", title: "Livraison", subtitle: "Suivre une commande" },
];

export default function App() {
  const [selectedMarket, setSelectedMarket] = useState("Burundi");
  const [search, setSearch] = useState("");
  const filteredMarkets = useMemo(
    () => markets.filter((m) => m.toLowerCase().includes(search.toLowerCase())),
    [search]
  );

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" backgroundColor="#087A45" />
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.header}>
          <View style={styles.brandRow}>
            <View style={styles.logo}><Text style={styles.logoText}>S</Text></View>
            <View>
              <Text style={styles.brand}>SokoLink</Text>
              <Text style={styles.tagline}>Le marché africain, connecté.</Text>
            </View>
          </View>
          <Text style={styles.headerNote}>Bienvenue sur SokoLink</Text>
          <Text style={styles.headerTitle}>Achetez et vendez à travers l’Afrique.</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Votre marché</Text>
          <Text style={styles.muted}>Choisissez le pays dans lequel vous souhaitez naviguer.</Text>
          <TextInput
            value={search}
            onChangeText={setSearch}
            placeholder="Rechercher un pays..."
            placeholderTextColor="#87938C"
            style={styles.search}
          />
          <View style={styles.marketList}>
            {filteredMarkets.slice(0, 8).map((market) => (
              <Pressable key={market} onPress={() => setSelectedMarket(market)}
                style={[styles.marketChip, selectedMarket === market && styles.marketChipActive]}>
                <Text style={[styles.marketText, selectedMarket === market && styles.marketTextActive]}>
                  {market}
                </Text>
              </Pressable>
            ))}
          </View>
          <Text style={styles.selected}>Marché sélectionné : {selectedMarket}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Que souhaitez-vous faire ?</Text>
          {categories.map((item) => (
            <Pressable key={item.title} style={styles.actionCard}>
              <Text style={styles.actionIcon}>{item.icon}</Text>
              <View style={styles.actionCopy}>
                <Text style={styles.actionTitle}>{item.title}</Text>
                <Text style={styles.muted}>{item.subtitle}</Text>
              </View>
              <Text style={styles.chevron}>›</Text>
            </Pressable>
          ))}
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerBrand}>SokoLink</Text>
          <Text style={styles.footerText}>Une plateforme. Plusieurs marchés. Toute l’Afrique.</Text>
          <Text style={styles.footerText}>Version de démonstration</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#F4F7F5" },
  container: { paddingBottom: 28 },
  header: { backgroundColor: "#087A45", paddingHorizontal: 22, paddingTop: 22, paddingBottom: 30, borderBottomLeftRadius: 24, borderBottomRightRadius: 24 },
  brandRow: { flexDirection: "row", alignItems: "center", gap: 12 },
  logo: { width: 48, height: 48, borderRadius: 15, backgroundColor: "#FFFFFF", alignItems: "center", justifyContent: "center" },
  logoText: { color: "#087A45", fontSize: 32, fontWeight: "900" },
  brand: { color: "#FFFFFF", fontSize: 25, fontWeight: "800" },
  tagline: { color: "#D7F0E2", fontSize: 12, marginTop: 2 },
  headerNote: { color: "#D7F0E2", marginTop: 28, fontSize: 13, fontWeight: "600" },
  headerTitle: { color: "#FFFFFF", fontSize: 25, fontWeight: "800", lineHeight: 32, marginTop: 7, maxWidth: 320 },
  section: { paddingHorizontal: 18, paddingTop: 24 },
  sectionTitle: { fontSize: 19, color: "#17251D", fontWeight: "800" },
  muted: { color: "#6F7D74", fontSize: 13, marginTop: 5 },
  search: { backgroundColor: "#FFFFFF", borderWidth: 1, borderColor: "#DFE8E2", borderRadius: 12, paddingHorizontal: 14, paddingVertical: 12, marginTop: 14, color: "#17251D" },
  marketList: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginTop: 12 },
  marketChip: { backgroundColor: "#FFFFFF", borderColor: "#DFE8E2", borderWidth: 1, borderRadius: 18, paddingHorizontal: 12, paddingVertical: 8 },
  marketChipActive: { backgroundColor: "#E0F3E8", borderColor: "#087A45" },
  marketText: { color: "#526158", fontSize: 12, fontWeight: "600" },
  marketTextActive: { color: "#087A45" },
  selected: { color: "#087A45", fontSize: 12, fontWeight: "700", marginTop: 12 },
  actionCard: { backgroundColor: "#FFFFFF", borderRadius: 16, padding: 16, marginTop: 11, flexDirection: "row", alignItems: "center", borderWidth: 1, borderColor: "#E7EEE9" },
  actionIcon: { fontSize: 26, width: 42 },
  actionCopy: { flex: 1 },
  actionTitle: { color: "#17251D", fontWeight: "800", fontSize: 16 },
  chevron: { color: "#087A45", fontSize: 28, paddingLeft: 8 },
  footer: { alignItems: "center", paddingHorizontal: 24, paddingTop: 30 },
  footerBrand: { color: "#087A45", fontWeight: "900", fontSize: 18 },
  footerText: { color: "#7B8980", fontSize: 11, marginTop: 5, textAlign: "center" }
});
