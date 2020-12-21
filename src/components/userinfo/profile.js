import React, { Component } from "react";
import { connect } from "react-redux";
import { reduxForm, Field } from "redux-form";
import { fetchProfile, clearProfile, updateProfile } from "../../actions/index";
import { assestsURL } from "../../services/Axios";

class Profile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      image: "",
    };
  }
  componentDidMount() {
    if (!this.props.initialValues) {
      this.props.fetchProfile(); // fetch profile
    }
  }

  componentWillUnmount() {
    this.props.clearProfile(); // clear the redux state (userinfo) when this component will unmount
  }

  handleFormSubmit({
    firstName,
    lastName,
    birthday,
    sex,
    phone,
    address,
    occupation,
    description,
  }) {
    const { image } = this.state;
    this.props.updateProfile(
      {
        firstName,
        lastName,
        birthday,
        sex,
        phone,
        address,
        occupation,
        description,
        image,
      },
      (path, state) => {
        // callback: history replace
        this.props.history.replace(path, state);
      }
    );
  }

  renderInput = (field) => (
    <fieldset className="form-group">
      <label>{field.label}</label>
      <input
        className="form-control"
        {...field.input}
        type={field.type}
        required={field.required ? "required" : ""}
        disabled={field.disabled ? "disabled" : ""}
      />
    </fieldset>
  );

  renderOptions = (field) => (
    <fieldset className="form-group">
      <label>{field.label}</label>
      <select className="form-control" {...field.input}>
        <option />
        <option value="male">Male</option>
        <option value="female">Female</option>
      </select>
    </fieldset>
  );

  renderTextarea = (field) => (
    <fieldset className="form-group">
      <label>{field.label}</label>
      <textarea className="form-control" {...field.input} />
    </fieldset>
  );

  renderAlert() {
    const { state } = this.props.history.location;
    const { action } = this.props.history;

    if (state && action === "REPLACE") {
      return (
        <div
          className={`alert ${
            state.status === "success" ? "alert-success" : "alert-danger"
          }`}
          role="alert"
        >
          {`[${state.time}] --- `}{" "}
          <strong>
            {state.status === "success" ? "Congratulations!" : "Oops!"}
          </strong>{" "}
          {state.message}
        </div>
      );
    }
  }

  render() {
    if (!this.props.initialValues) {
      // if the initialValues is null, render <div>Loading...</div>
      return <div>Loading...</div>;
    }
    const { handleSubmit } = this.props;
    const { image } = this.state;
    return (
      <div>
        {this.renderAlert()}
        <form
          className="form-profile"
          onSubmit={handleSubmit(this.handleFormSubmit.bind(this))}
        >
          <h3>Profile</h3>
          <hr />
          <br />
          <br />
          <img
            alt={""}
            className="img-responsive product-img"
            src={assestsURL + this.props.initialValues.photo}
            width="100px"
            height="100px"
          />
          <br />
          <br />
          {"Image"}
          <br />
          <br />
          <input
            accept="image/*"
            onChange={(e) => {
              this.setState({ image: e.target.files[0] }, () => {
                //console.log(image);
              });
            }}
            type="file"
          />
          <br />
          <br />
          <Field
            name="email"
            component={this.renderInput}
            type="email"
            label="Email:"
            disabled={true}
          />
          <Field
            name="firstName"
            component={this.renderInput}
            type="text"
            label="First Name:"
            required={true}
          />
          <Field
            name="lastName"
            component={this.renderInput}
            type="text"
            label="Last Name:"
            required={true}
          />
          <Field
            name="birthday"
            component={this.renderInput}
            type="date"
            label="Birthday:"
          />
          <Field name="sex" component={this.renderOptions} label="Sex:" />
          <Field
            name="phone"
            component={this.renderInput}
            type="text"
            label="Phone:"
          />
          <Field
            name="address"
            component={this.renderInput}
            type="text"
            label="Address:"
          />
          <Field
            name="occupation"
            component={this.renderInput}
            type="text"
            label="Occupation:"
          />
          <Field
            name="description"
            component={this.renderTextarea}
            label="Description:"
          />
          <button action="submit" className="btn btn-primary">
            Update Profile
          </button>
          {Object.entries(this.props.initialValues).map((item) => {
            console.log(item);
          })}
          <div>
            {Object.keys(this.props.initialValues).map((val, k) => {
              return (
                <h4 k={k}>
                  {val != "aadharcard" &&
                  val != "aadharcardb64" &&
                  val != "photo" &&
                  val != "aadhardetails"
                    ? val + " - " + this.props.initialValues[val]
                    : ""}
                  {val == "aadhardetails"
                    ? "aadhar_no" +
                      " - " +
                      JSON.stringify(
                        this.props.initialValues[val]["aadhar_no"]
                      ) +
                      " "
                    : ""}
                  {val == "aadhardetails"
                    ? "aadhardob" +
                      " - " +
                      JSON.stringify(this.props.initialValues[val]["date1"]) +
                      " "
                    : ""}
                  {val == "aadhardetails"
                    ? "aadharname" +
                      " - " +
                      JSON.stringify(this.props.initialValues[val]["name"]) +
                      " "
                    : ""}
                </h4>
              );
            })}
          </div>
        </form>
      </div>
    );
  }
}

/*
function validate(formProps) {
  console.log(formProps);
}
*/

Profile = reduxForm({
  form: "profile", // name of the form
  // validate: validate,
})(Profile);

function mapStateToProps(state) {
  return { initialValues: state.profile.user }; // set initial values for the form
}

export default connect(mapStateToProps, {
  fetchProfile,
  clearProfile,
  updateProfile,
})(Profile);
