import {
  ChoiceGroup,
  DefaultButton,
  Panel,
  PanelType,
  PrimaryButton,
  Stack,
  TagPicker,
  type IBasePicker,
  type IChoiceGroupOption,
  type IRefObject,
  type ITag,
} from "@fluentui/react";
import { createRef, useEffect, useState } from "react";
import type { LeadsInterface } from "../types";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import type { CustomFormprops } from "../types/props";
import { useFormik } from "formik";
import { object, string } from "yup";
import { useLocation } from "react-router-dom";

const LinkContactSchema = object({
  lead_id: string().optional(),
});
const LinkContactForm = ({
  isFormOpen,
  OpenForm,
  RefreshList,
}: CustomFormprops) => {
  const [contacts, setContacts] = useState<LeadsInterface[]>([]);
  const [selectedTags, setSelectedTags] = useState<ITag[]>([]);
  const [choiceGroupSlected, setchoiceGroupSlected] =
    useState<string>("getleads");
  const picker = createRef<IBasePicker<ITag>>();
  const axiosPrivate = useAxiosPrivate();

  const location = useLocation();
  const path = location.pathname.split("/")[2];
  const testTags: ITag[] = contacts.map((item) => ({
    key: item.id,
    name: item.name,
  }));
  const choiceGroupOptions: IChoiceGroupOption[] = [
    { key: "getleads", text: "Lead" },
    {
      key: "getcontacts",
      text: "Contact",
    },
  ];
  const getTextFromItem = (item: ITag) => item.name;
  const listContainsTag = (tag: ITag, tagList?: ITag[]): boolean =>
    !!tagList?.some((t) => t.key === tag.key);

  const filterSuggestedTags = (
    filterText: string,
    selectedItems?: ITag[]
  ): ITag[] => {
    return filterText
      ? testTags.filter(
          (tag) =>
            tag.name.toLowerCase().startsWith(filterText.toLowerCase()) &&
            !listContainsTag(tag, selectedItems)
        )
      : [];
  };
  useEffect(() => {
    const getAllContacts = async () => {
      try {
        const response = await axiosPrivate.get(`/Lead/${choiceGroupSlected}`);
        if (response.data) {
          setContacts(response.data);
        }
      } catch (error) {
        // console.log(error);
      }
    };
    getAllContacts();
    setSelectedTags([]);
  }, [choiceGroupSlected]);

  const formik = useFormik({
    initialValues: {
      lead_id: "",
    },
    validationSchema: LinkContactSchema,
    onSubmit: async (values) => {
      try {
        const response = await axiosPrivate.put(
          `/Client/linklead/${path}?lead_id=${values.lead_id}`
        );
        if (response) {
          OpenForm(false);
          RefreshList();
          resetForm();
        }
      } catch (error) {
        // console.log(error);
      }
    },
  });
  const { setFieldValue, handleSubmit, resetForm } = formik;
  return (
    <Panel
      headerText="Link Contact"
      isOpen={isFormOpen}
      onDismiss={() => OpenForm(undefined)}
      type={PanelType.medium}
      isLightDismiss={true}
      closeButtonAriaLabel="Close"
      onRenderFooterContent={() => (
        <Stack horizontal tokens={{ childrenGap: 12 }}>
          <PrimaryButton
            type="submit"
            form="LinkLeadForm"
            iconProps={{ iconName: "Save" }}
            // disabled={!dirty || !isValid}
          >
            Save
          </PrimaryButton>
          <DefaultButton
            iconProps={{ iconName: "cancel" }}
            onClick={() => OpenForm(false)}
          >
            Cancel
          </DefaultButton>
        </Stack>
      )}
      isFooterAtBottom={true}
    >
      <form id="LinkLeadForm" onSubmit={handleSubmit}>
        <Stack>
          <ChoiceGroup
            selectedKey={choiceGroupSlected}
            options={choiceGroupOptions}
            onChange={(_ev, option) => {
              if (option) {
                setchoiceGroupSlected(option.key);
              }
            }}
            styles={{
              flexContainer: {
                display: "flex",
                flexDirection: "row",
                columnGap: "20px",
              },
            }}
          />
          <TagPicker
            componentRef={picker as unknown as IRefObject<IBasePicker<ITag>>}
            removeButtonAriaLabel="Remove"
            selectionAriaLabel="Selected Contacts"
            onResolveSuggestions={filterSuggestedTags}
            getTextFromItem={getTextFromItem}
            selectedItems={selectedTags}
            onChange={(items) => {
              const selected = items?.slice(-1) || [];
              setSelectedTags(selected);
              setFieldValue("lead_id", selected[0]?.key || "");
            }}
            inputProps={{
              id: "picker1",
              placeholder: "Select contacts...",
            }}
            styles={{
              text: {
                padding: 5,
                borderRadius: 5,
                outline: "none",
                border: "1px solid rgba(0,0,0,.2)",
              },
            }}
          />
        </Stack>
      </form>
    </Panel>
  );
};

export default LinkContactForm;
