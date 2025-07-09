import { useFormik } from "formik";
import { array, object, string } from "yup";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import {
  ActionButton,
  DefaultButton,
  Panel,
  PanelType,
  PrimaryButton,
  Separator,
  Stack,
  TagPicker,
  Text,
  type IBasePicker,
  type IRefObject,
  type ITag,
} from "@fluentui/react";
import Custominput from "./common/Custominput";
import CustomSelect from "./common/CustomSelect";
import type { CustomFormprops } from "../types/props";
import { createRef, useEffect, useState } from "react";
import type { LeadsInterface } from "../types";
const ClientSchema = object({
  name: string().required("Name is required"),
  address: string().required("Address is required"),
  email: string()
    .matches(
      new RegExp("^[a-zA-Z0-9._:$!%-]+@[a-zA-Z0-9-]+(?:\\.[a-zA-Z0-9-]+)+$"),
      "Invalid email format"
    )
    .required("Email is required"),
  type: string()
    .oneOf(
      ["limited", "individual", "LLP", "Partnersihp"],
      `Type must be "limited", "individual", "LLP", "Partnersihp"`
    )
    .required("Type is required"),
  status: string()
    .oneOf(
      ["active", "inactive"],
      "Status must be either 'active' or 'inactive'"
    )
    .required("Status is required"),
  lead_id: array().of(string()).optional(),
});

const CreateClientForm = ({
  OpenForm,
  RefreshList,
  isFormOpen,
}: CustomFormprops) => {
  const axiosPrivate = useAxiosPrivate();
  const [contacts, setContacts] = useState<LeadsInterface[]>([]);
  const [linkContact, setLinkContact] = useState<boolean>(false);
  const [selectedTags, setSelectedTags] = useState<ITag[]>([]);

  const picker = createRef<IBasePicker<ITag>>();
  const testTags: ITag[] = contacts.map((item) => ({
    key: item.id,
    name: item.name,
  }));

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
        const response = await axiosPrivate.get("/Lead/getall");
        if (response.data) {
          setContacts(response.data);
        }
      } catch (error) {
        console.log(error);
      }
    };
    getAllContacts();
  }, []);

  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      type: "",
      status: "active",
      address: "",
      lead_id: [],
    },
    validationSchema: ClientSchema,
    onSubmit: async (values) => {
      console.log(values);
      
      // try {
      //   const response = await axiosPrivate.post(
      //     "/Client/createclient",
      //     values
      //   );
      //   if (response.data) {
      //     OpenForm(false);
      //     RefreshList();
      //   }
      // } catch (error) {
      //   console.log(error);
      // }
    },
  });
  const {
    values,
    touched,
    errors,
    handleBlur,
    handleChange,
    handleSubmit,
    setFieldValue,
  } = formik;
  return (
    <Panel
      headerText="Add Client"
      isOpen={isFormOpen}
      onDismiss={() => OpenForm(false)}
      type={PanelType.medium}
      closeButtonAriaLabel="Close"
      onRenderFooterContent={() => (
        <Stack horizontal tokens={{ childrenGap: 12 }}>
          <PrimaryButton type="submit" form="ClientForm">
            Save
          </PrimaryButton>
          <DefaultButton onClick={() => OpenForm(false)}>Cancel</DefaultButton>
        </Stack>
      )}
      isFooterAtBottom={true}
    >
      <Stack style={{ width: "100%" }}>
        <form id="ClientForm" style={{ width: "100%" }} onSubmit={handleSubmit}>
          <Stack tokens={{ childrenGap: 8 }} style={{ width: "100%" }}>
            <Stack
              horizontal
              tokens={{ childrenGap: 5 }}
              style={{ width: "100%" }}
            >
              <Stack style={{ width: "30%" }}>
                <CustomSelect
                  label="Type"
                  selectedKey={values.type}
                  onChange={(_, option) => setFieldValue("type", option?.key)}
                  onBlur={handleBlur}
                  options={[
                    {
                      key: "",
                      text: "Select Type",
                      disabled: true,
                    },
                    { key: "limited", text: "Limited" },
                    { key: "individual", text: "Individual" },
                    { key: "Partnersihp", text: "Partnersihp" },
                    { key: "LLP", text: "LLP" },
                  ]}
                  styles={{
                    root: { border: "none" },
                  }}
                />
                <Text className="error">{touched.type && errors.type}</Text>
              </Stack>
              <Stack style={{ width: "70%" }}>
                <Custominput
                  name="name"
                  type="text"
                  classname=" border-0"
                  placeholder="Business Name"
                  value={values.name}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
                <Text className="error">{touched.name && errors.name}</Text>
              </Stack>
            </Stack>
            <Stack>
              <Custominput
                name="email"
                type="email"
                classname=" border-0"
                placeholder="Email@Address"
                value={values.email}
                onChange={handleChange}
                onBlur={handleBlur}
              />
              <Text className="error">{touched.email && errors.email}</Text>
            </Stack>
            <Stack>
              <Custominput
                name="address"
                type="text"
                classname=" border-0"
                placeholder="Address"
                value={values.address}
                onChange={handleChange("address")}
                onBlur={handleBlur("address")}
              />

              <Text className="error">{touched.address && errors.address}</Text>
            </Stack>
            <Stack horizontalAlign="start">
              <ActionButton
                iconProps={{ iconName: `${linkContact ? "remove" : "add"}` }}
                onClick={() => setLinkContact((prev) => !prev)}
                styles={{
                  root: {
                    backgroundColor: "rgb(248, 248, 248)",
                    borderRadius: 8,
                    fontSize: 12,
                  },
                  icon: {
                    color: "rgb(51, 51, 51)",
                  },
                }}
              >
                Contact
              </ActionButton>
            </Stack>
            {linkContact && (
              <Stack>
                <Separator></Separator>
                <TagPicker
                  componentRef={
                    picker as unknown as IRefObject<IBasePicker<ITag>>
                  }
                  removeButtonAriaLabel="Remove"
                  selectionAriaLabel="Selected Contacts"
                  onResolveSuggestions={filterSuggestedTags}
                  getTextFromItem={getTextFromItem}
                  selectedItems={selectedTags}
                  onChange={(items) => {
                    const selected = items || [];
                    setSelectedTags(selected);
                    setFieldValue(
                      "lead_id",
                      selected.map((item) => item.key)
                    );
                  }}
                  inputProps={{
                    id: "picker1",
                    placeholder: "Select contacts...",
                  }}
                />
              </Stack>
            )}
          </Stack>
        </form>
      </Stack>
    </Panel>
  );
};

export default CreateClientForm;
