// Movie images and details for the CinemaTicket app
// Import local images
import salaarImg from './salaar.jpg';
import devaraImg from './Devara.jpg';
import transformerImg from './Transfomer.jpeg';
import soloLevImg from './Solo lev.jpg';

export const movieImages = {
  "Salaar": {
    poster: salaarImg,
    backdrop: salaarImg,
    trailer: "https://www.youtube.com/watch?v=bUR_FKt7Iso",
    description: "A gang leader tries to keep a promise made to his dying friend and takes on the other criminal gangs.",
    genre: "Action, Thriller",
    rating: "7.2/10"
  },
  "Devara": {
    poster: devaraImg,
    backdrop: devaraImg,
    trailer: "https://www.youtube.com/watch?v=RqPhVBpxGRc",
    description: "In the coastal regions where the land meets the sea, Devara rules with an iron fist, becoming a ray of hope for some and a terrifying nightmare for others.",
    genre: "Action, Drama, Thriller",
    rating: "Coming Soon"
  },
  "Transformer One": {
    poster: transformerImg,
    backdrop: transformerImg,
    trailer: "https://www.youtube.com/watch?v=Pc-G33H_n_k",
    description: "The origin story of Optimus Prime and Megatron, once friends who became bitter rivals, set on the planet Cybertron.",
    genre: "Animation, Action, Adventure",
    rating: "Coming Soon"
  },
  "Solo Leveling: ReAwakening": {
    poster: soloLevImg,
    backdrop: soloLevImg,
    trailer: "https://www.youtube.com/watch?v=4z9l2i9GBxA",
    description: "In a world where hunters with supernatural abilities battle deadly monsters, one infamous hunter Sung Jinwoo known as 'the world's weakest' gains an extraordinary power.",
    genre: "Animation, Action, Fantasy",
    rating: "9.1/10"
  }
};

// Banner image URLs for carousel - using local images
export const bannerImages = [
  salaarImg,
  devaraImg,
  transformerImg,
  soloLevImg
];

// Partner logos for footer
export const partnerLogos = [
  "https://in.bmscdn.com/webin/common/icons/logo-inox.svg", 
  "https://in.bmscdn.com/webin/common/icons/logo-pvr.svg",
  "https://in.bmscdn.com/webin/common/icons/logo-cinepolis.svg",
  "https://in.bmscdn.com/webin/common/icons/logo-carnival.svg",
  "https://in.bmscdn.com/webin/common/icons/logo-om.svg"
]; 