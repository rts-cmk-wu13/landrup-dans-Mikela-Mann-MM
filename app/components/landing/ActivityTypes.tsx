import Image from "next/image";
import { getActivityTypes, getAssetUrl } from "@/app/lib/api";
import type { ActivityType } from "@/app/types";

const FALLBACK_TYPES: ActivityType[] = [
  {
    id: 1,
    name: "Børnehold",
    description: "På børneholdene leger vi os ind i dansens verden gennem musik, bevægelse og fantasi. Undervisningen styrker motorik, rytme og kropsbevidsthed i trygge rammer. Fokus er på danseglæde, fællesskab og aktiv bevægelse, hvor alle kan være med.",
  },
  {
    id: 2,
    name: "Selskabs- og seniordans",
    description: "Selskabs- og seniordans kombinerer hyggeligt samvær med skånsom motion. Vi danser klassiske pardanse i et tempo, hvor alle kan følge med. Undervisningen styrker balance, koordination og kondition, samtidig med at fællesskabet og danseglæden er i centrum.",
  },
  {
    id: 3,
    name: "Moderne dans og ballet",
    description: "Moderne dans og ballet forener teknik, kropskontrol og musikalsk udtryk. Træningen forbedrer styrke, smidighed og holdning gennem varierede øvelser. Undervisningen foregår i en positiv atmosfære, hvor bevægelsesglæde og koncentration skaber både fordybelse og effektiv motion.",
  },
  {
    id: 4,
    name: "Streetdance og hiphop",
    description: "Streetdance og hiphop er energifyldt træning med fokus på rytme, attitude og fællesskab. Vi arbejder med grooves, koreografier og grundtrin, der styrker kondition og koordination. Stemningen er uformel og motiverende, så motion og danseglæde går hånd i hånd.",
  },
];

export default async function ActivityTypes() {
  let types: ActivityType[] = FALLBACK_TYPES;  

  try {
    const fetched = await getActivityTypes();
    if (fetched?.length) types = fetched;
  } catch {
   
  }

  return (
    <section className="px-6 py-10 bg-white">
      <h2 className="font-display text-2xl font-bold text-brand-dark mb-6">
        Vores holdtyper
      </h2>
      <div className="space-y-8">
        {types.map((type) => {
          const imageUrl = getAssetUrl(type.asset?.filename);  
          return (
            <div key={type.id}>
              <h3 className="font-display text-xl font-bold text-brand-dark mb-3">
                {type.name}
              </h3>
              {imageUrl && (
                <div className="relative h-48 rounded-xl overflow-hidden mb-3">
                  <Image
                    src={imageUrl}
                    alt={type.name}
                    fill
                    className="object-cover"
                    sizes="430px"
                  />
                </div>
              )}
              <p className="text-gray-600 text-sm leading-relaxed">
                {type.description}
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
}