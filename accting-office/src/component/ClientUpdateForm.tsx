import { useFormik } from "formik";
import { array, object, string } from "yup";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import {
  DefaultButton,
  Dropdown,
  Label,
  Panel,
  PanelType,
  PrimaryButton,
  Stack,
  Text,
  TextField,
} from "@fluentui/react";
import Custominput from "./common/Custominput";
import CustomSelect from "./common/CustomSelect";
import type { CustomFormprops } from "../types/props";
import type { ClientInterface } from "../types";
import { countries } from "../utils/ListsOptions";
import { ClientTypeCnversion, StatusConversion } from "../utils/EnumtoString";
const ClientSchema = object({
  name: string().required("Name is required"),
  address: object({
    street: string().required("Street is required"),
    area: string().required("Area is required"),
    city: string().required("City is required"),
    county: string().required("County is required"),
    pincode: string().required("Pincode is required"),
    country: string().required("Country is required"),
  }).required("Address is required"),
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
  contactIds: array().of(string()).optional(),
});
interface clientUpdateform extends CustomFormprops {
  value: ClientInterface;
}
const ClientUpdateForm = ({
  value,
  isFormOpen,
  OpenForm,
  RefreshList,
}: clientUpdateform) => {
  const axiosPrivate = useAxiosPrivate();

  // const [contacts, setContacts] = useState<LeadsInterface[]>([]);
  // const [selectedTags, setSelectedTags] = useState<ITag[]>(
  //   value?.contact_Details?.map((contact) => ({
  //     key: contact.id,
  //     name: contact.name,
  //   }))
  // );
  // const [choiceGroupSlected, setchoiceGroupSlected] =
  //   useState<string>("getleads");
  // const picker = createRef<IBasePicker<ITag>>();
  // const testTags: ITag[] = contacts.map((item) => ({
  //   key: item.id,
  //   name: item.name,
  // }));
  // const choiceGroupOptions: IChoiceGroupOption[] = [
  //   { key: "getleads", text: "Lead" },
  //   {
  //     key: "getcontacts",
  //     text: "Contact",
  //   },
  // ];
  // const getTextFromItem = (item: ITag) => item.name;
  // const listContainsTag = (tag: ITag, tagList?: ITag[]): boolean =>
  //   !!tagList?.some((t) => t.key === tag.key);

  // const filterSuggestedTags = (
  //   filterText: string,
  //   selectedItems?: ITag[]
  // ): ITag[] => {
  //   return filterText
  //     ? testTags.filter(
  //         (tag) =>
  //           tag.name.toLowerCase().startsWith(filterText.toLowerCase()) &&
  //           !listContainsTag(tag, selectedItems)
  //       )
  //     : [];
  // };

  // useEffect(() => {
  //   const getAllContacts = async () => {
  //     try {
  //       const response = await axiosPrivate.get(`/Lead/${choiceGroupSlected}`);
  //       if (response.data) {
  //         setContacts(response.data);
  //       }
  //     } catch (error) {
  //       console.log(error);
  //     }
  //   };
  //   getAllContacts();
  // }, [choiceGroupSlected]);

  const formik = useFormik({
    initialValues: {
      name: value.name,
      email: value.email,
      type: ClientTypeCnversion[value.type],
      status: StatusConversion[value.status],
      address: {
        street: value.address.street,
        area: value.address.area,
        city: value.address.city,
        county: value.address.county,
        pincode: value.address.pincode,
        country: value.address.country,
      },
      contactIds: value.contactIds,
    },
    validationSchema: ClientSchema,
    onSubmit: async (values) => {
      try {
        const response = await axiosPrivate.put(
          `/Client/updateclient/${value.id}`,
          values
        );
        if (response.data) {
          OpenForm(undefined);
          RefreshList();
          resetForm();
        }
      } catch (error) {
        // console.log(error);
      }
    },
  });
  const {
    values,
    handleBlur,
    handleChange,
    handleSubmit,
    touched,
    errors,
    dirty,
    setFieldValue,
    isValid,
    resetForm,
  } = formik;
  return (
    <Panel
      headerText="Update Client"
      isOpen={isFormOpen}
      onDismiss={() => OpenForm(undefined)}
      type={PanelType.medium}
      isLightDismiss={true}
      closeButtonAriaLabel="Close"
      onRenderFooterContent={() => (
        <Stack horizontal tokens={{ childrenGap: 12 }}>
          <PrimaryButton
            iconProps={{ iconName: "Save" }}
            type="submit"
            form="ClientUpdateForm"
            disabled={!dirty || !isValid}
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
      <Stack>
        <form id="ClientUpdateForm" onSubmit={handleSubmit}>
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
          <Stack style={{ width: "100%" }} tokens={{ childrenGap: 10 }}>
            <Label>Address:</Label>
            <Stack style={{ width: "100%" }} tokens={{ childrenGap: 10 }}>
              <Stack
                horizontal
                tokens={{ childrenGap: 8 }}
                style={{ width: "100%" }}
              >
                <TextField
                  name="address.street"
                  type="text"
                  placeholder="street"
                  value={values.address.street}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  styles={{
                    fieldGroup: {
                      padding: 5,
                      borderRadius: 5,
                      outline: "none",
                      border: "1px solid rgba(0,0,0,.2)",
                    },
                    root: {
                      width: "50%",
                    },
                  }}
                ></TextField>
                <TextField
                  name="address.area"
                  type="text"
                  placeholder="area"
                  value={values.address.area}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  styles={{
                    fieldGroup: {
                      padding: 5,
                      borderRadius: 5,
                      outline: "none",
                      border: "1px solid rgba(0,0,0,.2)",
                    },
                    root: {
                      width: "50%",
                    },
                  }}
                ></TextField>
              </Stack>
            </Stack>
            <Stack style={{ width: "100%" }}>
              <Stack
                horizontal
                tokens={{ childrenGap: 8 }}
                style={{ width: "100%" }}
              >
                <TextField
                  name="address.city"
                  type="text"
                  placeholder="City"
                  value={values.address.city}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  styles={{
                    fieldGroup: {
                      padding: 5,
                      borderRadius: 5,
                      outline: "none",
                      border: "1px solid rgba(0,0,0,.2)",
                    },
                    root: {
                      width: "50%",
                    },
                  }}
                ></TextField>
                <TextField
                  name="address.county"
                  type="text"
                  placeholder="county"
                  value={values.address.county}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  styles={{
                    fieldGroup: {
                      padding: 5,
                      borderRadius: 5,
                      outline: "none",
                      border: "1px solid rgba(0,0,0,.2)",
                    },
                    root: {
                      width: "50%",
                    },
                  }}
                ></TextField>
              </Stack>
            </Stack>
            <Stack style={{ width: "100%" }}>
              <Stack
                horizontal
                tokens={{ childrenGap: 8 }}
                style={{ width: "100%" }}
              >
                <TextField
                  name="address.pincode"
                  type="text"
                  placeholder="Postcode"
                  value={values.address.pincode}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  styles={{
                    fieldGroup: {
                      padding: 5,
                      borderRadius: 5,
                      outline: "none",
                      border: "1px solid rgba(0,0,0,.2)",
                    },
                    root: {
                      width: "50%",
                    },
                  }}
                ></TextField>
                <Dropdown
                
                  placeholder="Select a country"
                  selectedKey={values.address.country}
                  onChange={(_, option) =>
                    setFieldValue("address.country", option?.key)
                  }
                  onBlur={handleBlur}
                  options={[
                    {
                      key: "",
                      text: "Select Country",
                      disabled: true,
                    },
                    ...countries,
                  ]}
                  styles={{
                    title: {
                      border: "1px solid rgba(0,0,0,.2)",
                      borderRadius: 6,
                    },
                    callout: {
                      borderRadius: 5,
                    },
                    dropdown: {
                      border: "none",
                      outline: "none",
                    },
                    root: {
                      width: "50%",
                    },
                  }}
                />
              </Stack>
            </Stack>
            <Stack>
              <CustomSelect
                label="Status"
                selectedKey={values.status}
                onChange={(_, option) => setFieldValue("status", option?.key)}
                onBlur={handleBlur}
                options={[
                  {
                    key: "",
                    text: "Please select  status of client",
                    disabled: true,
                  },
                  { key: "active", text: "Active" },
                  { key: "inactive", text: "In-Active" },
                ]}
                styles={{
                  root: { border: "none" },
                }}
              />
              <Text className="error">{touched.status && errors.status}</Text>
            </Stack>
          </Stack>
          {/* <Stack horizontalAlign="start">
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
          </Stack> */}
          {/* {linkContact && ( */}
          {/* <Stack tokens={{ childrenGap: 8 }}>
            <Separator></Separator>
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
                const selected = items || [];
                setSelectedTags(selected);
                setFieldValue(
                  "contact_Ids",
                  selected.map((item) => item.key)
                );
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
          </Stack> */}
          {/* )} */}
        </form>
      </Stack>
    </Panel>
  );
};
export default ClientUpdateForm;