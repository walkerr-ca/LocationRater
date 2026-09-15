import {
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
  IonContent,
  IonFab,
  IonFabButton,
  IonHeader,
  IonIcon,
  IonLoading,
  IonPage,
  IonText,
  IonTitle,
  IonToolbar,
} from "@ionic/react";

import { useRatings } from "../../hooks/queries/ratings";

import "./index.css";
import { add } from "ionicons/icons";
import { AddRatingModal } from "../../components/AddRatingModal";

const Ratings: React.FC = () => {
  const { data, isLoading } = useRatings();

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Ratings</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonFab slot="fixed" vertical="bottom" horizontal="end">
          <IonFabButton id="open-add-rating-modal">
            <IonIcon icon={add}></IonIcon>
          </IonFabButton>
        </IonFab>
        <div
          style={{
            width: "100%",
            display: "flex",
            flexDirection: "column",
            gap: "1rem",
            padding: "1rem",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {isLoading && <IonLoading />}
          {data ? (
            data.length > 0 ? (
              <>
                {data.map((rating) => (
                  <IonCard
                    key={rating.ID}
                    style={{
                      width: "100%",
                    }}
                  >
                    <IonCardHeader>
                      <IonCardSubtitle>{rating.Rating} / 5 stars</IonCardSubtitle>
                      <IonCardTitle>{rating.Title}</IonCardTitle>
                    </IonCardHeader>
                    <IonCardContent>
                      <IonText>
                        <p>{rating.Description}</p>
                      </IonText>
                    </IonCardContent>
                  </IonCard>
                ))}
              </>
            ) : (
              <IonCard>
                <IonCardHeader>
                  <IonCardTitle>No reviews yet</IonCardTitle>
                </IonCardHeader>
                <IonCardContent>
                  <IonText>
                    <p>Click the plus at the bottom to be the first to leave a review!</p>
                  </IonText>
                </IonCardContent>
              </IonCard>
            )
          ) : null}
        </div>
        <AddRatingModal />
      </IonContent>
    </IonPage>
  );
};

export default Ratings;
