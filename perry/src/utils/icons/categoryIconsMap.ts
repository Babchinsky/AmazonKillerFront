import Category from "../../assets/icons/category.svg?react";
import Clothes from "../../assets/icons/clothes.svg?react";
import Hanger from "../../assets/icons/hanger.svg?react";
import Ruler from "../../assets/icons/ruler.svg?react";
import Bed from "../../assets/icons/bed.svg?react";
import BoxingGloves from "../../assets/icons/boxing-gloves.svg?react";
import Cleaner from "../../assets/icons/cleaner.svg?react";
import CleaningSpray from "../../assets/icons/cleaning-spray.svg?react";
import JumpRope from "../../assets/icons/jump-rope.svg?react";
import Laptop from "../../assets/icons/laptop.svg?react";
import Hammer from "../../assets/icons/hammer.svg?react";
import VacuumCleaner from "../../assets/icons/vacuum-cleaner.svg?react";
import WashingMachine from "../../assets/icons/washing-machine.svg?react";
import Computer from "../../assets/icons/computer.svg?react";
import Sofa from "../../assets/icons/sofa.svg?react";


const iconMap: Record<string, React.FC<React.SVGProps<SVGSVGElement>>> = {
  Clothes,
  Hanger,
  Ruler,
  Bed,
  BoxingGloves,
  Cleaner,
  CleaningSpray,
  JumpRope,
  Laptop,
  Hammer,
  VacuumCleaner,
  WashingMachine,
  Computer,
  Sofa
};

function getCategoryIcon(name: string) {
  return iconMap[name] ?? Category;
}

export { getCategoryIcon };