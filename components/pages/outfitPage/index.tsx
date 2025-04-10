import SelectingOutfitPage from "./selecting";
import OutFitPageComp from "./view";

export default function Index({ selecting }: { selecting?: boolean } = {}) {
  return selecting ? <SelectingOutfitPage /> : <OutFitPageComp />;
}
