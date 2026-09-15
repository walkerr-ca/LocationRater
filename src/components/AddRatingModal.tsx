import { useRef, useState, useMemo, useEffect } from "react";
import {
  IonModal,
  IonHeader,
  IonToolbar,
  IonButtons,
  IonButton,
  IonTitle,
  IonContent,
  IonItem,
  IonInput,
  IonText,
} from "@ionic/react";
import { IonModalCustomEvent, OverlayEventDetail } from "@ionic/core";
import { Geolocation } from "@capacitor/geolocation";

import {
  createRatingSchema,
  CreateRatingSchema,
  useCreateRatingMutation,
} from "../hooks/mutations/create-rating";
import { useQueryClient } from "@tanstack/react-query";

const baseInput = {
  longitude: 0.0,
  latitude: 0.0,
  title: "",
  description: "",
  rating: 0,
};

export const AddRatingModal = () => {
  const queryClient = useQueryClient();
  const modal = useRef<HTMLIonModalElement>(null);

  const { mutate, isPending, isSuccess, error } = useCreateRatingMutation();

  const [input, setInput] = useState<CreateRatingSchema>({ ...baseInput });
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  const submit = () => {
    mutate(input);
  };

  const handleClose = (event: IonModalCustomEvent<OverlayEventDetail>) => {
    if (event.detail.role === "confirm") {
      queryClient.invalidateQueries({
        queryKey: ["ratings"],
      });
    }
  };

  useMemo(async () => {
    const position = await Geolocation.getCurrentPosition();
    setInput({
      ...input,
      longitude: position.coords.longitude,
      latitude: position.coords.latitude,
    });
  }, []);

  useEffect(() => {
    const { error } = createRatingSchema.safeParse(input);
    if (error) {
      const errorDict: Record<string, string> = {};
      error.issues.forEach((issue) => {
        const key = issue.path.join("");
        errorDict[key] = issue.message;
      });

      setValidationErrors(errorDict);
    } else {
      setValidationErrors({});
    }
  }, [input]);

  useEffect(() => {
    modal.current?.dismiss("", "confirm");
  }, [isSuccess]);

  return (
    <IonModal ref={modal} trigger="open-add-rating-modal" onWillDismiss={handleClose}>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonButton onClick={() => modal.current?.dismiss()}>Cancel</IonButton>
          </IonButtons>
          <IonTitle>New Review</IonTitle>
          <IonButtons slot="end">
            <IonButton
              strong={true}
              onClick={() => submit()}
              disabled={isPending || Object.keys(validationErrors).length > 0}
            >
              Submit
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonItem>
          <div
            style={{
              width: "100%",
              display: "flex",
              flexDirection: "column",
              paddingTop: "1rem",
              paddingBottom: "1rem",
            }}
          >
            <IonInput
              label="Title"
              labelPlacement="floating"
              fill="outline"
              placeholder="Enter title"
              value={input.title}
              onIonInput={(e) => setInput({ ...input, title: (e.target.value ?? "").toString() })}
            />
            {validationErrors["title"] && (
              <IonText color="danger">
                <p>{validationErrors["title"]}</p>
              </IonText>
            )}
          </div>
        </IonItem>
        <IonItem>
          <div
            style={{
              width: "100%",
              display: "flex",
              flexDirection: "column",
              paddingTop: "1rem",
              paddingBottom: "1rem",
            }}
          >
            <IonInput
              label="Description"
              labelPlacement="floating"
              fill="outline"
              placeholder="Enter description"
              value={input.description}
              onIonInput={(e) =>
                setInput({ ...input, description: (e.target.value ?? "").toString() })
              }
            />
            {validationErrors["description"] && (
              <IonText color="danger">
                <p>{validationErrors["description"]}</p>
              </IonText>
            )}
          </div>
        </IonItem>
        <IonItem>
          <div
            style={{
              width: "100%",
              display: "flex",
              flexDirection: "column",
              paddingTop: "1rem",
              paddingBottom: "1rem",
            }}
          >
            <IonInput
              label="Rating"
              labelPlacement="floating"
              fill="outline"
              placeholder="Enter rating"
              type="number"
              value={input.rating}
              onIonInput={(e) => setInput({ ...input, rating: Number(e.target.value ?? "0") })}
            />
            {validationErrors["rating"] && (
              <IonText color="danger">
                <p>{validationErrors["rating"]}</p>
              </IonText>
            )}
          </div>
        </IonItem>
        {error && (
          <IonItem>
            <IonText color="danger">
              <p>{error.message}</p>
            </IonText>
          </IonItem>
        )}
      </IonContent>
    </IonModal>
  );
};
