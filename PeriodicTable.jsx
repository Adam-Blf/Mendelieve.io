import React, { useState, useEffect, useMemo } from 'react';
import { Search, X, Info, Atom, FlaskConical, Filter, Layers, Zap, Globe, Volume2, Loader2, ExternalLink } from 'lucide-react';

// --- DATA ---
// Nous conservons la structure de base (Position, Symbole, Numéro) en statique pour garantir un rendu instantané de la grille.
// Les détails riches (Description, Image) seront désormais récupérés via l'API Wikipédia.
const elementsData = [
  { number: 1, symbol: "H", name: "Hydrogène", mass: "1.008", category: "diatomic nonmetal", occurrence: "Univers (75%), Eau", group: 1, period: 1, xpos: 1, ypos: 1, discovered_by: "Henry Cavendish", year: 1766 },
  { number: 2, symbol: "He", name: "Hélium", mass: "4.0026", category: "noble gas", occurrence: "Gaz naturel (sous-sol), Univers", group: 18, period: 1, xpos: 18, ypos: 1, discovered_by: "Pierre Janssen", year: 1868 },
  { number: 3, symbol: "Li", name: "Lithium", mass: "6.94", category: "alkali metal", occurrence: "Roches ignées, Saumures", group: 1, period: 2, xpos: 1, ypos: 2, discovered_by: "Johan August Arfwedson", year: 1817 },
  { number: 4, symbol: "Be", name: "Béryllium", mass: "9.0122", category: "alkaline earth metal", occurrence: "Minerais (Béryl)", group: 2, period: 2, xpos: 2, ypos: 2, discovered_by: "Louis Nicolas Vauquelin", year: 1798 },
  { number: 5, symbol: "B", name: "Bore", mass: "10.81", category: "metalloid", occurrence: "Minerais (Borax)", group: 13, period: 2, xpos: 13, ypos: 2, discovered_by: "Joseph Louis Gay-Lussac", year: 1808 },
  { number: 6, symbol: "C", name: "Carbone", mass: "12.011", category: "polyatomic nonmetal", occurrence: "Matière vivante, Charbon", group: 14, period: 2, xpos: 14, ypos: 2, discovered_by: "Égypte antique", year: "Antiquité" },
  { number: 7, symbol: "N", name: "Azote", mass: "14.007", category: "diatomic nonmetal", occurrence: "Atmosphère (78%)", group: 15, period: 2, xpos: 15, ypos: 2, discovered_by: "Daniel Rutherford", year: 1772 },
  { number: 8, symbol: "O", name: "Oxygène", mass: "15.999", category: "diatomic nonmetal", occurrence: "Atmosphère (21%), Eau", group: 16, period: 2, xpos: 16, ypos: 2, discovered_by: "Carl Wilhelm Scheele", year: 1774 },
  { number: 9, symbol: "F", name: "Fluor", mass: "18.998", category: "diatomic nonmetal", occurrence: "Minéral (Fluorite)", group: 17, period: 2, xpos: 17, ypos: 2, discovered_by: "Henri Moissan", year: 1886 },
  { number: 10, symbol: "Ne", name: "Néon", mass: "20.180", category: "noble gas", occurrence: "Atmosphère (Traces)", group: 18, period: 2, xpos: 18, ypos: 2, discovered_by: "William Ramsay", year: 1898 },
  { number: 11, symbol: "Na", name: "Sodium", mass: "22.990", category: "alkali metal", occurrence: "Eau de mer, Sel gemme", group: 1, period: 3, xpos: 1, ypos: 3, discovered_by: "Humphry Davy", year: 1807 },
  { number: 12, symbol: "Mg", name: "Magnésium", mass: "24.305", category: "alkaline earth metal", occurrence: "Croûte terrestre, Eau de mer", group: 2, period: 3, xpos: 2, ypos: 3, discovered_by: "Joseph Black", year: 1755 },
  { number: 13, symbol: "Al", name: "Aluminium", mass: "26.982", category: "post-transition metal", occurrence: "Croûte terrestre (Bauxite)", group: 13, period: 3, xpos: 13, ypos: 3, discovered_by: "Hans Christian Ørsted", year: 1825 },
  { number: 14, symbol: "Si", name: "Silicium", mass: "28.085", category: "metalloid", occurrence: "Croûte terrestre (Sable/Quartz)", group: 14, period: 3, xpos: 14, ypos: 3, discovered_by: "Jöns Jacob Berzelius", year: 1824 },
  { number: 15, symbol: "P", name: "Phosphore", mass: "30.974", category: "polyatomic nonmetal", occurrence: "Roches phosphatées", group: 15, period: 3, xpos: 15, ypos: 3, discovered_by: "Hennig Brand", year: 1669 },
  { number: 16, symbol: "S", name: "Soufre", mass: "32.06", category: "polyatomic nonmetal", occurrence: "Dépôts volcaniques", group: 16, period: 3, xpos: 16, ypos: 3, discovered_by: "Chine antique", year: "Antiquité" },
  { number: 17, symbol: "Cl", name: "Chlore", mass: "35.45", category: "diatomic nonmetal", occurrence: "Eau de mer (Sel)", group: 17, period: 3, xpos: 17, ypos: 3, discovered_by: "Carl Wilhelm Scheele", year: 1774 },
  { number: 18, symbol: "Ar", name: "Argon", mass: "39.948", category: "noble gas", occurrence: "Atmosphère (~1%)", group: 18, period: 3, xpos: 18, ypos: 3, discovered_by: "Lord Rayleigh", year: 1894 },
  { number: 19, symbol: "K", name: "Potassium", mass: "39.098", category: "alkali metal", occurrence: "Sels (Potasse)", group: 1, period: 4, xpos: 1, ypos: 4, discovered_by: "Humphry Davy", year: 1807 },
  { number: 20, symbol: "Ca", name: "Calcium", mass: "40.078", category: "alkaline earth metal", occurrence: "Roches calcaires", group: 2, period: 4, xpos: 2, ypos: 4, discovered_by: "Humphry Davy", year: 1808 },
  { number: 21, symbol: "Sc", name: "Scandium", mass: "44.956", category: "transition metal", occurrence: "Minerais rares", group: 3, period: 4, xpos: 3, ypos: 4, discovered_by: "Lars Fredrik Nilson", year: 1879 },
  { number: 22, symbol: "Ti", name: "Titane", mass: "47.867", category: "transition metal", occurrence: "Minerais (Ilménite)", group: 4, period: 4, xpos: 4, ypos: 4, discovered_by: "William Gregor", year: 1791 },
  { number: 23, symbol: "V", name: "Vanadium", mass: "50.942", category: "transition metal", occurrence: "Minerais", group: 5, period: 4, xpos: 5, ypos: 4, discovered_by: "Andrés Manuel del Río", year: 1801 },
  { number: 24, symbol: "Cr", name: "Chrome", mass: "51.996", category: "transition metal", occurrence: "Minerais (Chromite)", group: 6, period: 4, xpos: 6, ypos: 4, discovered_by: "Louis Nicolas Vauquelin", year: 1797 },
  { number: 25, symbol: "Mn", name: "Manganèse", mass: "54.938", category: "transition metal", occurrence: "Minerais (Pyrolusite)", group: 7, period: 4, xpos: 7, ypos: 4, discovered_by: "Johan Gottlieb Gahn", year: 1774 },
  { number: 26, symbol: "Fe", name: "Fer", mass: "55.845", category: "transition metal", occurrence: "Minerais (Hématite)", group: 8, period: 4, xpos: 8, ypos: 4, discovered_by: "Antiquité", year: "Antiquité" },
  { number: 27, symbol: "Co", name: "Cobalt", mass: "58.933", category: "transition metal", occurrence: "Minerais (souvent avec Cu/Ni)", group: 9, period: 4, xpos: 9, ypos: 4, discovered_by: "Georg Brandt", year: 1735 },
  { number: 28, symbol: "Ni", name: "Nickel", mass: "58.693", category: "transition metal", occurrence: "Minerais / Météorites", group: 10, period: 4, xpos: 10, ypos: 4, discovered_by: "Axel Fredrik Cronstedt", year: 1751 },
  { number: 29, symbol: "Cu", name: "Cuivre", mass: "63.546", category: "transition metal", occurrence: "Minerais sulfurés", group: 11, period: 4, xpos: 11, ypos: 4, discovered_by: "Moyen-Orient", year: "Antiquité" },
  { number: 30, symbol: "Zn", name: "Zinc", mass: "65.38", category: "transition metal", occurrence: "Minerais (Sphalérite)", group: 12, period: 4, xpos: 12, ypos: 4, discovered_by: "Inde", year: "Antiquité" },
  { number: 31, symbol: "Ga", name: "Gallium", mass: "69.723", category: "post-transition metal", occurrence: "Trace dans Bauxite", group: 13, period: 4, xpos: 13, ypos: 4, discovered_by: "Lecoq de Boisbaudran", year: 1875 },
  { number: 32, symbol: "Ge", name: "Germanium", mass: "72.630", category: "metalloid", occurrence: "Minerais de Zinc", group: 14, period: 4, xpos: 14, ypos: 4, discovered_by: "Clemens Winkler", year: 1886 },
  { number: 33, symbol: "As", name: "Arsenic", mass: "74.922", category: "metalloid", occurrence: "Minerais", group: 15, period: 4, xpos: 15, ypos: 4, discovered_by: "Albertus Magnus", year: 1250 },
  { number: 34, symbol: "Se", name: "Sélénium", mass: "78.971", category: "polyatomic nonmetal", occurrence: "Raffinage du cuivre", group: 16, period: 4, xpos: 16, ypos: 4, discovered_by: "Jöns Jacob Berzelius", year: 1817 },
  { number: 35, symbol: "Br", name: "Brome", mass: "79.904", category: "diatomic nonmetal", occurrence: "Eau de mer", group: 17, period: 4, xpos: 17, ypos: 4, discovered_by: "Antoine Jérôme Balard", year: 1826 },
  { number: 36, symbol: "Kr", name: "Krypton", mass: "83.798", category: "noble gas", occurrence: "Atmosphère (Traces)", group: 18, period: 4, xpos: 18, ypos: 4, discovered_by: "William Ramsay", year: 1898 },
  { number: 37, symbol: "Rb", name: "Rubidium", mass: "85.468", category: "alkali metal", occurrence: "Minerais (Lépidolite)", group: 1, period: 5, xpos: 1, ypos: 5, discovered_by: "Robert Bunsen", year: 1861 },
  { number: 38, symbol: "Sr", name: "Strontium", mass: "87.62", category: "alkaline earth metal", occurrence: "Minerais (Célestine)", group: 2, period: 5, xpos: 2, ypos: 5, discovered_by: "William Cruickshank", year: 1787 },
  { number: 39, symbol: "Y", name: "Yttrium", mass: "88.906", category: "transition metal", occurrence: "Terres rares", group: 3, period: 5, xpos: 3, ypos: 5, discovered_by: "Johan Gadolin", year: 1794 },
  { number: 40, symbol: "Zr", name: "Zirconium", mass: "91.224", category: "transition metal", occurrence: "Minerais (Zircon)", group: 4, period: 5, xpos: 4, ypos: 5, discovered_by: "Martin Heinrich Klaproth", year: 1789 },
  { number: 41, symbol: "Nb", name: "Niobium", mass: "92.906", category: "transition metal", occurrence: "Minerais (Coltan)", group: 5, period: 5, xpos: 5, ypos: 5, discovered_by: "Charles Hatchett", year: 1801 },
  { number: 42, symbol: "Mo", name: "Molybdène", mass: "95.95", category: "transition metal", occurrence: "Minerais (Molybdénite)", group: 6, period: 5, xpos: 6, ypos: 5, discovered_by: "Carl Wilhelm Scheele", year: 1778 },
  { number: 43, symbol: "Tc", name: "Technétium", mass: "(98)", category: "transition metal", occurrence: "Synthétique", group: 7, period: 5, xpos: 7, ypos: 5, discovered_by: "Emilio Segrè", year: 1937 },
  { number: 44, symbol: "Ru", name: "Ruthénium", mass: "101.07", category: "transition metal", occurrence: "Mines de Platine", group: 8, period: 5, xpos: 8, ypos: 5, discovered_by: "Karl Ernst Claus", year: 1844 },
  { number: 45, symbol: "Rh", name: "Rhodium", mass: "102.91", category: "transition metal", occurrence: "Mines de Platine", group: 9, period: 5, xpos: 9, ypos: 5, discovered_by: "William Hyde Wollaston", year: 1804 },
  { number: 46, symbol: "Pd", name: "Palladium", mass: "106.42", category: "transition metal", occurrence: "Mines de Platine", group: 10, period: 5, xpos: 10, ypos: 5, discovered_by: "William Hyde Wollaston", year: 1803 },
  { number: 47, symbol: "Ag", name: "Argent", mass: "107.87", category: "transition metal", occurrence: "Minerais / Natif", group: 11, period: 5, xpos: 11, ypos: 5, discovered_by: "Antiquité", year: "Antiquité" },
  { number: 48, symbol: "Cd", name: "Cadmium", mass: "112.41", category: "transition metal", occurrence: "Minerais de Zinc", group: 12, period: 5, xpos: 12, ypos: 5, discovered_by: "Karl Samuel Leberecht Hermann", year: 1817 },
  { number: 49, symbol: "In", name: "Indium", mass: "114.82", category: "post-transition metal", occurrence: "Minerais de Zinc", group: 13, period: 5, xpos: 13, ypos: 5, discovered_by: "Ferdinand Reich", year: 1863 },
  { number: 50, symbol: "Sn", name: "Étain", mass: "118.71", category: "post-transition metal", occurrence: "Minerais (Cassitérite)", group: 14, period: 5, xpos: 14, ypos: 5, discovered_by: "Antiquité", year: "Antiquité" },
  { number: 51, symbol: "Sb", name: "Antimoine", mass: "121.76", category: "metalloid", occurrence: "Minerais (Stibine)", group: 15, period: 5, xpos: 15, ypos: 5, discovered_by: "Antiquité", year: "Antiquité" },
  { number: 52, symbol: "Te", name: "Tellure", mass: "127.60", category: "metalloid", occurrence: "Raffinage du cuivre", group: 16, period: 5, xpos: 16, ypos: 5, discovered_by: "Franz-Joseph Müller von Reichenstein", year: 1782 },
  { number: 53, symbol: "I", name: "Iode", mass: "126.90", category: "diatomic nonmetal", occurrence: "Eau de mer, Algues", group: 17, period: 5, xpos: 17, ypos: 5, discovered_by: "Bernard Courtois", year: 1811 },
  { number: 54, symbol: "Xe", name: "Xénon", mass: "131.29", category: "noble gas", occurrence: "Atmosphère (Traces)", group: 18, period: 5, xpos: 18, ypos: 5, discovered_by: "William Ramsay", year: 1898 },
  { number: 55, symbol: "Cs", name: "Césium", mass: "132.91", category: "alkali metal", occurrence: "Minerais (Pollucite)", group: 1, period: 6, xpos: 1, ypos: 6, discovered_by: "Robert Bunsen", year: 1860 },
  { number: 56, symbol: "Ba", name: "Baryum", mass: "137.33", category: "alkaline earth metal", occurrence: "Minerais (Barytine)", group: 2, period: 6, xpos: 2, ypos: 6, discovered_by: "Carl Wilhelm Scheele", year: 1772 },
  { number: 57, symbol: "La", name: "Lanthane", mass: "138.91", category: "lanthanide", occurrence: "Terres rares", group: 3, period: 6, xpos: 3, ypos: 9, discovered_by: "Carl Gustaf Mosander", year: 1839 },
  { number: 58, symbol: "Ce", name: "Cérium", mass: "140.12", category: "lanthanide", occurrence: "Terres rares (Monazite)", group: 3, period: 6, xpos: 4, ypos: 9, discovered_by: "Martin Heinrich Klaproth", year: 1803 },
  { number: 59, symbol: "Pr", name: "Praséodyme", mass: "140.91", category: "lanthanide", occurrence: "Terres rares", group: 3, period: 6, xpos: 5, ypos: 9, discovered_by: "Carl Auer von Welsbach", year: 1885 },
  { number: 60, symbol: "Nd", name: "Néodyme", mass: "144.24", category: "lanthanide", occurrence: "Terres rares", group: 3, period: 6, xpos: 6, ypos: 9, discovered_by: "Carl Auer von Welsbach", year: 1885 },
  { number: 61, symbol: "Pm", name: "Prométhium", mass: "(145)", category: "lanthanide", occurrence: "Synthétique / Traces d'Uranium", group: 3, period: 6, xpos: 7, ypos: 9, discovered_by: "Chien Shiung Wu", year: 1945 },
  { number: 62, symbol: "Sm", name: "Samarium", mass: "150.36", category: "lanthanide", occurrence: "Terres rares", group: 3, period: 6, xpos: 8, ypos: 9, discovered_by: "Lecoq de Boisbaudran", year: 1879 },
  { number: 63, symbol: "Eu", name: "Europium", mass: "151.96", category: "lanthanide", occurrence: "Terres rares", group: 3, period: 6, xpos: 9, ypos: 9, discovered_by: "Eugène-Anatole Demarçay", year: 1901 },
  { number: 64, symbol: "Gd", name: "Gadolinium", mass: "157.25", category: "lanthanide", occurrence: "Terres rares", group: 3, period: 6, xpos: 10, ypos: 9, discovered_by: "Jean Charles Galissard de Marignac", year: 1880 },
  { number: 65, symbol: "Tb", name: "Terbium", mass: "158.93", category: "lanthanide", occurrence: "Terres rares", group: 3, period: 6, xpos: 11, ypos: 9, discovered_by: "Carl Gustaf Mosander", year: 1843 },
  { number: 66, symbol: "Dy", name: "Dysprosium", mass: "162.50", category: "lanthanide", occurrence: "Terres rares", group: 3, period: 6, xpos: 12, ypos: 9, discovered_by: "Lecoq de Boisbaudran", year: 1886 },
  { number: 67, symbol: "Ho", name: "Holmium", mass: "164.93", category: "lanthanide", occurrence: "Terres rares", group: 3, period: 6, xpos: 13, ypos: 9, discovered_by: "Marc Delafontaine", year: 1878 },
  { number: 68, symbol: "Er", name: "Erbium", mass: "167.26", category: "lanthanide", occurrence: "Terres rares", group: 3, period: 6, xpos: 14, ypos: 9, discovered_by: "Carl Gustaf Mosander", year: 1843 },
  { number: 69, symbol: "Tm", name: "Thulium", mass: "168.93", category: "lanthanide", occurrence: "Terres rares", group: 3, period: 6, xpos: 15, ypos: 9, discovered_by: "Per Teodor Cleve", year: 1879 },
  { number: 70, symbol: "Yb", name: "Ytterbium", mass: "173.05", category: "lanthanide", occurrence: "Terres rares", group: 3, period: 6, xpos: 16, ypos: 9, discovered_by: "Jean Charles Galissard de Marignac", year: 1878 },
  { number: 71, symbol: "Lu", name: "Lutécium", mass: "174.97", category: "lanthanide", occurrence: "Terres rares", group: 3, period: 6, xpos: 17, ypos: 9, discovered_by: "Georges Urbain", year: 1907 },
  { number: 72, symbol: "Hf", name: "Hafnium", mass: "178.49", category: "transition metal", occurrence: "Minerais de Zirconium", group: 4, period: 6, xpos: 4, ypos: 6, discovered_by: "Dirk Coster", year: 1923 },
  { number: 73, symbol: "Ta", name: "Tantale", mass: "180.95", category: "transition metal", occurrence: "Minerais (Coltan)", group: 5, period: 6, xpos: 5, ypos: 6, discovered_by: "Anders Gustaf Ekeberg", year: 1802 },
  { number: 74, symbol: "W", name: "Tungstène", mass: "183.84", category: "transition metal", occurrence: "Minerais (Wolframite)", group: 6, period: 6, xpos: 6, ypos: 6, discovered_by: "José and Fausto Elhuyar", year: 1783 },
  { number: 75, symbol: "Re", name: "Rhénium", mass: "186.21", category: "transition metal", occurrence: "Mines de Molybdène", group: 7, period: 6, xpos: 7, ypos: 6, discovered_by: "Masataka Ogawa", year: 1908 },
  { number: 76, symbol: "Os", name: "Osmium", mass: "190.23", category: "transition metal", occurrence: "Mines de Platine", group: 8, period: 6, xpos: 8, ypos: 6, discovered_by: "Smithson Tennant", year: 1803 },
  { number: 77, symbol: "Ir", name: "Iridium", mass: "192.22", category: "transition metal", occurrence: "Mines de Platine / Météorites", group: 9, period: 6, xpos: 9, ypos: 6, discovered_by: "Smithson Tennant", year: 1803 },
  { number: 78, symbol: "Pt", name: "Platine", mass: "195.08", category: "transition metal", occurrence: "Minerais (Natif)", group: 10, period: 6, xpos: 10, ypos: 6, discovered_by: "Antonio de Ulloa", year: 1735 },
  { number: 79, symbol: "Au", name: "Or", mass: "196.97", category: "transition metal", occurrence: "Minerais (Natif)", group: 11, period: 6, xpos: 11, ypos: 6, discovered_by: "Antiquité", year: "Antiquité" },
  { number: 80, symbol: "Hg", name: "Mercure", mass: "200.59", category: "transition metal", occurrence: "Minerais (Cinabre)", group: 12, period: 6, xpos: 12, ypos: 6, discovered_by: "Antiquité", year: "Antiquité" },
  { number: 81, symbol: "Tl", name: "Thallium", mass: "204.38", category: "post-transition metal", occurrence: "Mines de Cuivre/Zinc", group: 13, period: 6, xpos: 13, ypos: 6, discovered_by: "William Crookes", year: 1861 },
  { number: 82, symbol: "Pb", name: "Plomb", mass: "207.2", category: "post-transition metal", occurrence: "Minerais (Galène)", group: 14, period: 6, xpos: 14, ypos: 6, discovered_by: "Antiquité", year: "Antiquité" },
  { number: 83, symbol: "Bi", name: "Bismuth", mass: "208.98", category: "post-transition metal", occurrence: "Minerais", group: 15, period: 6, xpos: 15, ypos: 6, discovered_by: "Claude François Geoffroy", year: 1753 },
  { number: 84, symbol: "Po", name: "Polonium", mass: "(209)", category: "post-transition metal", occurrence: "Minerais d'Uranium", group: 16, period: 6, xpos: 16, ypos: 6, discovered_by: "Pierre and Marie Curie", year: 1898 },
  { number: 85, symbol: "At", name: "Astate", mass: "(210)", category: "metalloid", occurrence: "Traces infimes (Décroissance)", group: 17, period: 6, xpos: 17, ypos: 6, discovered_by: "Dale R. Corson", year: 1940 },
  { number: 86, symbol: "Rn", name: "Radon", mass: "(222)", category: "noble gas", occurrence: "Décroissance radioactive (Sol)", group: 18, period: 6, xpos: 18, ypos: 6, discovered_by: "Friedrich Ernst Dorn", year: 1900 },
  { number: 87, symbol: "Fr", name: "Francium", mass: "(223)", category: "alkali metal", occurrence: "Traces infimes (Décroissance)", group: 1, period: 7, xpos: 1, ypos: 7, discovered_by: "Marguerite Perey", year: 1939 },
  { number: 88, symbol: "Ra", name: "Radium", mass: "(226)", category: "alkaline earth metal", occurrence: "Minerais d'Uranium", group: 2, period: 7, xpos: 2, ypos: 7, discovered_by: "Pierre and Marie Curie", year: 1898 },
  { number: 89, symbol: "Ac", name: "Actinium", mass: "(227)", category: "actinide", occurrence: "Minerais d'Uranium", group: 3, period: 7, xpos: 3, ypos: 10, discovered_by: "Friedrich Oskar Giesel", year: 1902 },
  { number: 90, symbol: "Th", name: "Thorium", mass: "232.04", category: "actinide", occurrence: "Minerais (Monazite)", group: 3, period: 7, xpos: 4, ypos: 10, discovered_by: "Jöns Jacob Berzelius", year: 1829 },
  { number: 91, symbol: "Pa", name: "Protactinium", mass: "231.04", category: "actinide", occurrence: "Minerais d'Uranium", group: 3, period: 7, xpos: 5, ypos: 10, discovered_by: "William Crookes", year: 1913 },
  { number: 92, symbol: "U", name: "Uranium", mass: "238.03", category: "actinide", occurrence: "Croûte terrestre (Pechblende)", group: 3, period: 7, xpos: 6, ypos: 10, discovered_by: "Martin Heinrich Klaproth", year: 1789 },
  { number: 93, symbol: "Np", name: "Neptunium", mass: "(237)", category: "actinide", occurrence: "Synthétique (Traces naturelles)", group: 3, period: 7, xpos: 7, ypos: 10, discovered_by: "Edwin McMillan", year: 1940 },
  { number: 94, symbol: "Pu", name: "Plutonium", mass: "(244)", category: "actinide", occurrence: "Synthétique (Traces naturelles)", group: 3, period: 7, xpos: 8, ypos: 10, discovered_by: "Glenn T. Seaborg", year: 1940 },
  { number: 95, symbol: "Am", name: "Américium", mass: "(243)", category: "actinide", occurrence: "Synthétique", group: 3, period: 7, xpos: 9, ypos: 10, discovered_by: "Glenn T. Seaborg", year: 1944 },
  { number: 96, symbol: "Cm", name: "Curium", mass: "(247)", category: "actinide", occurrence: "Synthétique", group: 3, period: 7, xpos: 10, ypos: 10, discovered_by: "Glenn T. Seaborg", year: 1944 },
  { number: 97, symbol: "Bk", name: "Berkélium", mass: "(247)", category: "actinide", occurrence: "Synthétique", group: 3, period: 7, xpos: 11, ypos: 10, discovered_by: "Glenn T. Seaborg", year: 1949 },
  { number: 98, symbol: "Cf", name: "Californium", mass: "(251)", category: "actinide", occurrence: "Synthétique", group: 3, period: 7, xpos: 12, ypos: 10, discovered_by: "Glenn T. Seaborg", year: 1950 },
  { number: 99, symbol: "Es", name: "Einsteinium", mass: "(252)", category: "actinide", occurrence: "Synthétique", group: 3, period: 7, xpos: 13, ypos: 10, discovered_by: "Albert Ghiorso", year: 1952 },
  { number: 100, symbol: "Fm", name: "Fermium", mass: "(257)", category: "actinide", occurrence: "Synthétique", group: 3, period: 7, xpos: 14, ypos: 10, discovered_by: "Albert Ghiorso", year: 1952 },
  { number: 101, symbol: "Md", name: "Mendélévium", mass: "(258)", category: "actinide", occurrence: "Synthétique", group: 3, period: 7, xpos: 15, ypos: 10, discovered_by: "Albert Ghiorso", year: 1955 },
  { number: 102, symbol: "No", name: "Nobélium", mass: "(259)", category: "actinide", occurrence: "Synthétique", group: 3, period: 7, xpos: 16, ypos: 10, discovered_by: "Institut Nobel de physique", year: 1966 },
  { number: 103, symbol: "Lr", name: "Lawrencium", mass: "(262)", category: "actinide", occurrence: "Synthétique", group: 3, period: 7, xpos: 17, ypos: 10, discovered_by: "Albert Ghiorso", year: 1961 },
  { number: 104, symbol: "Rf", name: "Rutherfordium", mass: "(267)", category: "transition metal", occurrence: "Synthétique", group: 4, period: 7, xpos: 4, ypos: 7, discovered_by: "Institut unifié de recherches nucléaires", year: 1964 },
  { number: 105, symbol: "Db", name: "Dubnium", mass: "(268)", category: "transition metal", occurrence: "Synthétique", group: 5, period: 7, xpos: 5, ypos: 7, discovered_by: "Institut unifié de recherches nucléaires", year: 1968 },
  { number: 106, symbol: "Sg", name: "Seaborgium", mass: "(271)", category: "transition metal", occurrence: "Synthétique", group: 6, period: 7, xpos: 6, ypos: 7, discovered_by: "Lawrence Berkeley National Laboratory", year: 1974 },
  { number: 107, symbol: "Bh", name: "Bohrium", mass: "(272)", category: "transition metal", occurrence: "Synthétique", group: 7, period: 7, xpos: 7, ypos: 7, discovered_by: "GSI Helmholtz Centre", year: 1981 },
  { number: 108, symbol: "Hs", name: "Hassium", mass: "(270)", category: "transition metal", occurrence: "Synthétique", group: 8, period: 7, xpos: 8, ypos: 7, discovered_by: "GSI Helmholtz Centre", year: 1984 },
  { number: 109, symbol: "Mt", name: "Meitnerium", mass: "(276)", category: "unknown", occurrence: "Synthétique", group: 9, period: 7, xpos: 9, ypos: 7, discovered_by: "GSI Helmholtz Centre", year: 1982 },
  { number: 110, symbol: "Ds", name: "Darmstadtium", mass: "(281)", category: "unknown", occurrence: "Synthétique", group: 10, period: 7, xpos: 10, ypos: 7, discovered_by: "GSI Helmholtz Centre", year: 1994 },
  { number: 111, symbol: "Rg", name: "Roentgenium", mass: "(280)", category: "unknown", occurrence: "Synthétique", group: 11, period: 7, xpos: 11, ypos: 7, discovered_by: "GSI Helmholtz Centre", year: 1994 },
  { number: 112, symbol: "Cn", name: "Copernicium", mass: "(285)", category: "transition metal", occurrence: "Synthétique", group: 12, period: 7, xpos: 12, ypos: 7, discovered_by: "GSI Helmholtz Centre", year: 1996 },
  { number: 113, symbol: "Nh", name: "Nihonium", mass: "(284)", category: "unknown", occurrence: "Synthétique", group: 13, period: 7, xpos: 13, ypos: 7, discovered_by: "RIKEN", year: 2003 },
  { number: 114, symbol: "Fl", name: "Flérovium", mass: "(289)", category: "post-transition metal", occurrence: "Synthétique", group: 14, period: 7, xpos: 14, ypos: 7, discovered_by: "Institut unifié de recherches nucléaires", year: 1998 },
  { number: 115, symbol: "Mc", name: "Moscovium", mass: "(288)", category: "unknown", occurrence: "Synthétique", group: 15, period: 7, xpos: 15, ypos: 7, discovered_by: "Institut unifié de recherches nucléaires", year: 2003 },
  { number: 116, symbol: "Lv", name: "Livermorium", mass: "(293)", category: "unknown", occurrence: "Synthétique", group: 16, period: 7, xpos: 16, ypos: 7, discovered_by: "Institut unifié de recherches nucléaires", year: 2000 },
  { number: 117, symbol: "Ts", name: "Tennesse", mass: "(294)", category: "unknown", occurrence: "Synthétique", group: 17, period: 7, xpos: 17, ypos: 7, discovered_by: "Institut unifié de recherches nucléaires", year: 2010 },
  { number: 118, symbol: "Og", name: "Oganesson", mass: "(294)", category: "noble gas", occurrence: "Synthétique", group: 18, period: 7, xpos: 18, ypos: 7, discovered_by: "Institut unifié de recherches nucléaires", year: 2002 },
];

const categories = {
  "diatomic nonmetal": { 
    name: "Non-métaux diatomiques", 
    border: "border-cyan-400", 
    bg: "bg-cyan-500/20", 
    text: "text-cyan-300", 
    shadow: "shadow-cyan-500/50" 
  },
  "noble gas": { 
    name: "Gaz nobles", 
    border: "border-purple-400", 
    bg: "bg-purple-500/20", 
    text: "text-purple-300", 
    shadow: "shadow-purple-500/50" 
  },
  "alkali metal": { 
    name: "Métaux alcalins", 
    border: "border-red-500", 
    bg: "bg-red-500/20", 
    text: "text-red-300", 
    shadow: "shadow-red-500/50" 
  },
  "alkaline earth metal": { 
    name: "Métaux alcalino-terreux", 
    border: "border-orange-400", 
    bg: "bg-orange-500/20", 
    text: "text-orange-300", 
    shadow: "shadow-orange-500/50" 
  },
  "metalloid": { 
    name: "Métalloïdes", 
    border: "border-teal-400", 
    bg: "bg-teal-500/20", 
    text: "text-teal-300", 
    shadow: "shadow-teal-500/50" 
  },
  "polyatomic nonmetal": { 
    name: "Non-métaux polyatomiques", 
    border: "border-indigo-400", 
    bg: "bg-indigo-500/20", 
    text: "text-indigo-300", 
    shadow: "shadow-indigo-500/50" 
  },
  "post-transition metal": { 
    name: "Métaux pauvres", 
    border: "border-blue-400", 
    bg: "bg-blue-500/20", 
    text: "text-blue-300", 
    shadow: "shadow-blue-500/50" 
  },
  "transition metal": { 
    name: "Métaux de transition", 
    border: "border-yellow-400", 
    bg: "bg-yellow-500/20", 
    text: "text-yellow-200", 
    shadow: "shadow-yellow-500/50" 
  },
  "lanthanide": { 
    name: "Lanthanides", 
    border: "border-pink-400", 
    bg: "bg-pink-500/20", 
    text: "text-pink-300", 
    shadow: "shadow-pink-500/50" 
  },
  "actinide": { 
    name: "Actinides", 
    border: "border-fuchsia-500", 
    bg: "bg-fuchsia-500/20", 
    text: "text-fuchsia-300", 
    shadow: "shadow-fuchsia-500/50" 
  },
  "unknown": { 
    name: "Inconnus / Synthétiques", 
    border: "border-gray-500", 
    bg: "bg-gray-500/20", 
    text: "text-gray-300", 
    shadow: "shadow-gray-500/50" 
  },
};

export default function PeriodicTable() {
  const [selectedElement, setSelectedElement] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState(null);
  const [hoveredCategory, setHoveredCategory] = useState(null);

  // États pour les données dynamiques (API)
  const [wikiData, setWikiData] = useState(null);
  const [isWikiLoading, setIsWikiLoading] = useState(false);

  // --- API LOGIC ---
  // Récupère les données de Wikipédia à la volée lors de la sélection
  useEffect(() => {
    if (selectedElement) {
      setWikiData(null); // Reset pour éviter d'afficher les données du précédent
      setIsWikiLoading(true);

      const fetchWikiInfo = async () => {
        try {
          // Utilisation de l'API REST v1 de Wikipédia (gratuite et performante)
          // Documentation: https://fr.wikipedia.org/api/rest_v1/
          const response = await fetch(
            `https://fr.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(selectedElement.name)}`
          );
          
          if (!response.ok) throw new Error("Erreur réseau");
          
          const data = await response.json();
          setWikiData({
            extract: data.extract,
            thumbnail: data.thumbnail?.source,
            pageUrl: data.content_urls?.desktop?.page
          });
        } catch (error) {
          console.error("Erreur lors de la récupération des données Wikipédia", error);
          setWikiData({
            extract: "Désolé, impossible de récupérer les informations détaillées pour le moment.",
            thumbnail: null,
            pageUrl: `https://fr.wikipedia.org/wiki/${selectedElement.name}`
          });
        } finally {
          setIsWikiLoading(false);
        }
      };

      fetchWikiInfo();
    }
  }, [selectedElement]);

  // Fonction de synthèse vocale (Web Speech API)
  const speakElementName = (e) => {
    e.stopPropagation(); // Empêche de fermer la modale si le bouton est cliqué
    if ('speechSynthesis' in window && selectedElement) {
      window.speechSynthesis.cancel(); // Arrête toute lecture en cours
      const utterance = new SpeechSynthesisUtterance(selectedElement.name);
      utterance.lang = 'fr-FR';
      utterance.rate = 1;
      window.speechSynthesis.speak(utterance);
    }
  };


  const filteredElements = useMemo(() => {
    return elementsData.filter((el) => {
      const matchesSearch =
        el.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        el.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
        el.number.toString().includes(searchTerm);
      const matchesCategory = activeCategory ? el.category === activeCategory : true;
      return matchesSearch && matchesCategory;
    });
  }, [searchTerm, activeCategory]);

  const isDimmed = (el) => {
    if (hoveredCategory) return el.category !== hoveredCategory;
    if (activeCategory || searchTerm) return !filteredElements.includes(el);
    return false;
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans overflow-hidden relative selection:bg-pink-500 selection:text-white">
      
      {/* Background Gradients Effects */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-900/20 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-900/20 rounded-full blur-[120px]" />
      </div>

      <div className="relative z-10 flex flex-col h-screen">
        
        {/* --- Header Compact --- */}
        <header className="px-6 py-4 border-b border-white/10 bg-black/40 backdrop-blur-md flex flex-col md:flex-row justify-between items-center gap-4 shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-500/10 rounded-lg border border-blue-500/30">
              <Atom className="w-6 h-6 text-blue-400" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400">
                Mendeleïev.io
              </h1>
              <p className="text-xs text-gray-400 uppercase tracking-widest">Tableau Périodique Interactif</p>
            </div>
          </div>

          <div className="relative group w-full max-w-md">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-gray-500 group-focus-within:text-blue-400 transition-colors" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-2 bg-white/5 border border-white/10 rounded-full text-sm placeholder-gray-500 text-white focus:outline-none focus:border-blue-500/50 focus:bg-white/10 focus:ring-1 focus:ring-blue-500/20 transition-all"
              placeholder="Rechercher (ex: Or, Au, 79)..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-white"
              >
                <X className="h-3 w-3" />
              </button>
            )}
          </div>
        </header>

        {/* --- Main Content Area --- */}
        <div className="flex-1 flex overflow-hidden">
          
          {/* Sidebar Left: Legend / Filters */}
          <aside className="w-64 hidden lg:flex flex-col border-r border-white/10 bg-black/20 backdrop-blur-sm p-4 overflow-y-auto shrink-0 custom-scrollbar">
            <div className="flex items-center gap-2 mb-4 text-xs font-bold text-gray-400 uppercase tracking-wider">
              <Layers className="w-3 h-3" /> Catégories
            </div>
            
            <div className="space-y-1">
              <button
                 onClick={() => setActiveCategory(null)}
                 className={`w-full text-left px-3 py-2 rounded-md text-sm transition-all flex items-center justify-between group
                   ${!activeCategory ? "bg-white/10 text-white font-medium" : "text-gray-400 hover:bg-white/5 hover:text-gray-200"}`}
              >
                <span>Tout afficher</span>
                {!activeCategory && <div className="w-1.5 h-1.5 rounded-full bg-white shadow-[0_0_8px_white]" />}
              </button>

              {Object.entries(categories).map(([key, config]) => (
                <button
                  key={key}
                  onClick={() => setActiveCategory(activeCategory === key ? null : key)}
                  onMouseEnter={() => setHoveredCategory(key)}
                  onMouseLeave={() => setHoveredCategory(null)}
                  className={`w-full text-left px-3 py-2 rounded-md text-xs transition-all border border-transparent flex items-center gap-3 group
                    ${activeCategory === key ? `bg-white/10 ${config.text} border-white/10` : "text-gray-400 hover:bg-white/5"}`}
                >
                  <div className={`w-2 h-2 rounded-full ${config.bg.replace('/20', '')} ${config.shadow} transition-transform group-hover:scale-125`} />
                  <span className={`group-hover:text-gray-200 ${activeCategory === key ? "font-medium" : ""}`}>{config.name}</span>
                </button>
              ))}
            </div>
          </aside>

          {/* Main Area: The Table */}
          <main className="flex-1 overflow-auto p-4 md:p-8 relative custom-scrollbar flex items-center justify-center bg-grid-pattern">
            
            <div 
              className="grid gap-1 md:gap-2 mx-auto select-none"
              style={{ 
                gridTemplateColumns: "repeat(18, minmax(2.5rem, 1fr))", 
                width: "min(1400px, 100%)"
              }}
            >
              {elementsData.map((element) => {
                const style = categories[element.category] || categories["unknown"];
                const dimmed = isDimmed(element);
                const isSelected = selectedElement?.number === element.number;
                
                return (
                  <div
                    key={element.number}
                    onClick={() => setSelectedElement(element)}
                    onMouseEnter={() => {}}
                    className={`
                      relative aspect-[4/5] flex flex-col justify-between p-1 rounded transition-all duration-300 cursor-pointer
                      border backdrop-blur-sm
                      ${dimmed ? "opacity-10 grayscale scale-95 border-transparent" : "opacity-100 scale-100 hover:scale-110 hover:z-50"}
                      ${isSelected ? `ring-2 ring-white z-40 ${style.bg} ${style.border}` : `bg-white/5 border-white/10 hover:border-white/40`}
                      group
                    `}
                    style={{
                      gridColumn: element.xpos,
                      gridRow: element.ypos,
                    }}
                  >
                    {!dimmed && (
                      <div className={`absolute inset-0 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none bg-gradient-to-br from-white/10 to-transparent ${style.shadow.replace('shadow-', 'shadow-inner-')}`} />
                    )}

                    <div className="flex justify-between items-start leading-none z-10">
                      <span className="text-[0.55rem] md:text-[0.7rem] font-mono opacity-50">{element.number}</span>
                    </div>
                    <div className={`text-center font-bold text-sm md:text-xl z-10 ${style.text} drop-shadow-sm`}>
                      {element.symbol}
                    </div>
                    <div className="text-center text-[0.45rem] md:text-[0.6rem] truncate w-full opacity-70 z-10 group-hover:opacity-100 transition-opacity">
                      {element.name}
                    </div>
                  </div>
                );
              })}

              <div className="col-start-3 row-start-6 flex items-center justify-center text-xs text-white/20 font-mono border border-white/5 rounded border-dashed">57-71</div>
              <div className="col-start-3 row-start-7 flex items-center justify-center text-xs text-white/20 font-mono border border-white/5 rounded border-dashed">89-103</div>
            </div>
          </main>

          {/* Right Panel: Detail View (Slide-over) with Dynamic Data */}
          {selectedElement && (
            <div className="w-80 md:w-96 bg-black/80 backdrop-blur-xl border-l border-white/10 p-6 overflow-y-auto shrink-0 animate-in slide-in-from-right duration-300 absolute right-0 inset-y-0 md:relative z-50 shadow-2xl">
              
              <button 
                onClick={() => setSelectedElement(null)}
                className="absolute top-4 right-4 p-1 rounded-full hover:bg-white/10 text-gray-400 hover:text-white transition"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="mt-8 flex flex-col items-center">
                {/* Large Symbol Display */}
                <div className={`
                   relative w-32 h-32 rounded-2xl flex items-center justify-center mb-6
                   border-2 ${categories[selectedElement.category].border} 
                   bg-gradient-to-br ${categories[selectedElement.category].bg} to-transparent
                   shadow-[0_0_30px_rgba(0,0,0,0.5)]
                `}>
                   {/* Affichage de l'image Wikipédia si disponible, sinon fallback sur l'effet néon */}
                   {wikiData?.thumbnail ? (
                      <div className="absolute inset-0 p-1">
                        <img 
                          src={wikiData.thumbnail} 
                          alt={selectedElement.name} 
                          className="w-full h-full object-cover rounded-xl opacity-80 mix-blend-overlay"
                        />
                         <div className={`absolute inset-0 blur-xl opacity-40 ${categories[selectedElement.category].bg}`} />
                      </div>
                   ) : (
                      <div className={`absolute inset-0 blur-xl opacity-40 ${categories[selectedElement.category].bg}`} />
                   )}
                   
                   <span className={`text-6xl font-bold ${categories[selectedElement.category].text} drop-shadow-md z-10`}>
                     {selectedElement.symbol}
                   </span>
                   <span className="absolute top-2 left-3 text-sm font-mono opacity-60">{selectedElement.number}</span>
                   <span className="absolute bottom-2 right-3 text-sm font-mono opacity-60">{selectedElement.mass}</span>
                </div>

                <div className="flex items-center gap-2 mb-1">
                  <h2 className="text-3xl font-bold">{selectedElement.name}</h2>
                  <button 
                    onClick={speakElementName}
                    className="p-2 rounded-full bg-white/5 hover:bg-white/10 text-blue-400 transition-colors"
                    title="Prononcer"
                  >
                    <Volume2 className="w-5 h-5" />
                  </button>
                </div>
                
                <span className={`px-3 py-1 rounded-full text-xs font-medium border ${categories[selectedElement.category].border} ${categories[selectedElement.category].text} bg-black/30`}>
                   {categories[selectedElement.category].name}
                </span>
              </div>

              <div className="mt-8 space-y-6">
                
                <div className="bg-white/5 rounded-xl p-4 border border-white/5 hover:border-white/10 transition-colors min-h-[120px]">
                  <h3 className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-3 flex items-center gap-2">
                    <Info className="w-3 h-3" /> Résumé Encyclopédique
                  </h3>
                  
                  {isWikiLoading ? (
                    <div className="flex justify-center items-center py-4">
                      <Loader2 className="w-6 h-6 text-blue-400 animate-spin" />
                    </div>
                  ) : (
                    <p className="text-sm text-gray-300 leading-relaxed text-justify">
                      {wikiData?.extract || "Chargement..."}
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-3">
                   <div className="bg-white/5 rounded-lg p-3 border border-white/5 col-span-2">
                      <div className="text-xs text-gray-500 uppercase mb-1 flex items-center gap-1">
                        <Globe className="w-3 h-3" /> Origine / Source majeure
                      </div>
                      <div className="text-sm text-white font-medium flex items-center gap-2">
                        {selectedElement.occurrence || "Non spécifié"}
                      </div>
                   </div>

                   <div className="bg-white/5 rounded-lg p-3 border border-white/5">
                      <div className="text-xs text-gray-500 uppercase mb-1">Période</div>
                      <div className="text-xl font-mono">{selectedElement.period}</div>
                   </div>
                   <div className="bg-white/5 rounded-lg p-3 border border-white/5">
                      <div className="text-xs text-gray-500 uppercase mb-1">Groupe</div>
                      <div className="text-xl font-mono">{selectedElement.group}</div>
                   </div>
                   <div className="bg-white/5 rounded-lg p-3 border border-white/5 col-span-2">
                      <div className="text-xs text-gray-500 uppercase mb-1 flex items-center gap-1">
                        <Zap className="w-3 h-3" /> Découverte
                      </div>
                      <div className="text-sm flex flex-col">
                        <span className="text-white font-medium">{selectedElement.year}</span>
                        <span className="text-gray-400 text-xs">{selectedElement.discovered_by}</span>
                      </div>
                   </div>
                </div>

                <a 
                   href={wikiData?.pageUrl || `https://fr.wikipedia.org/wiki/${selectedElement.name}`} 
                   target="_blank" 
                   rel="noreferrer"
                   className="flex items-center justify-center w-full py-3 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-medium transition-all shadow-lg shadow-blue-900/20 hover:shadow-blue-600/40 text-sm mt-4 gap-2"
                >
                   <ExternalLink className="w-4 h-4" />
                   Voir l'article complet
                </a>

              </div>
            </div>
          )}

        </div>
      </div>
      
      {/* CSS Pattern for grid background */}
      <style>{`
        .bg-grid-pattern {
          background-size: 40px 40px;
          background-image: 
            linear-gradient(to right, rgba(255, 255, 255, 0.03) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255, 255, 255, 0.03) 1px, transparent 1px);
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
          height: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(0,0,0,0.2);
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255,255,255,0.1);
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(255,255,255,0.2);
        }
      `}</style>
    </div>
  );
}