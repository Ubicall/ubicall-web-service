/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define("sipfriends", {
    id: {
      type: DataTypes.INTEGER(11),
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: ""
    },
    ipaddr: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    port: {
      type: DataTypes.INTEGER(5),
      allowNull: true,
    },
    regseconds: {
      type: DataTypes.INTEGER(11),
      allowNull: true,
    },
    defaultuser: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    fullcontact: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    regserver: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    useragent: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    lastms: {
      type: DataTypes.INTEGER(11),
      allowNull: true,
    },
    host: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: "dynamic"
    },
    type: {
      type: DataTypes.ENUM("friend","user","peer"),
      allowNull: true,
    },
    context: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    permit: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    deny: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    secret: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    md5secret: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    remotesecret: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    transport: {
      type: DataTypes.ENUM("udp","tcp","udp,tcp","tcp,udp"),
      allowNull: true,
    },
    dtmfmode: {
      type: DataTypes.ENUM("rfc2833","info","shortinfo","inband","auto"),
      allowNull: true,
    },
    directmedia: {
      type: DataTypes.ENUM("yes","no","nonat","update"),
      allowNull: true,
    },
    nat: {
      type: DataTypes.ENUM("no","force_rport","comedia","force_rport,comedia","auto_force_rport","auto_comedia"),
      allowNull: true,
    },
    callgroup: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    pickupgroup: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    language: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    disallow: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    allow: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    insecure: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    trustrpid: {
      type: DataTypes.ENUM("yes","no"),
      allowNull: true,
    },
    progressinband: {
      type: DataTypes.ENUM("yes","no","never"),
      allowNull: true,
    },
    promiscredir: {
      type: DataTypes.ENUM("yes","no"),
      allowNull: true,
    },
    useclientcode: {
      type: DataTypes.ENUM("yes","no"),
      allowNull: true,
    },
    accountcode: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    setvar: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    callerid: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    amaflags: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    callcounter: {
      type: DataTypes.ENUM("yes","no"),
      allowNull: true,
    },
    busylevel: {
      type: DataTypes.INTEGER(11),
      allowNull: true,
    },
    allowoverlap: {
      type: DataTypes.ENUM("yes","no"),
      allowNull: true,
    },
    allowsubscribe: {
      type: DataTypes.ENUM("yes","no"),
      allowNull: true,
    },
    videosupport: {
      type: DataTypes.ENUM("yes","no"),
      allowNull: true,
    },
    maxcallbitrate: {
      type: DataTypes.INTEGER(11),
      allowNull: true,
    },
    rfc2833compensate: {
      type: DataTypes.ENUM("yes","no"),
      allowNull: true,
    },
    mailbox: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    "session-timers": {
      type: DataTypes.ENUM("accept","refuse","originate"),
      allowNull: true,
    },
    "session-expires": {
      type: DataTypes.INTEGER(11),
      allowNull: true,
    },
    "session-minse": {
      type: DataTypes.INTEGER(11),
      allowNull: true,
    },
    "session-refresher": {
      type: DataTypes.ENUM("uac","uas"),
      allowNull: true,
    },
    t38pt_usertpsource: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    regexten: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    fromdomain: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    fromuser: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    qualify: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    defaultip: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    rtptimeout: {
      type: DataTypes.INTEGER(11),
      allowNull: true,
    },
    rtpholdtimeout: {
      type: DataTypes.INTEGER(11),
      allowNull: true,
    },
    sendrpid: {
      type: DataTypes.ENUM("yes","no"),
      allowNull: true,
    },
    outboundproxy: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    callbackextension: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    registertrying: {
      type: DataTypes.ENUM("yes","no"),
      allowNull: true,
    },
    timert1: {
      type: DataTypes.INTEGER(11),
      allowNull: true,
    },
    timerb: {
      type: DataTypes.INTEGER(11),
      allowNull: true,
    },
    qualifyfreq: {
      type: DataTypes.INTEGER(11),
      allowNull: true,
    },
    constantssrc: {
      type: DataTypes.ENUM("yes","no"),
      allowNull: true,
    },
    contactpermit: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    contactdeny: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    usereqphone: {
      type: DataTypes.ENUM("yes","no"),
      allowNull: true,
    },
    textsupport: {
      type: DataTypes.ENUM("yes","no"),
      allowNull: true,
    },
    faxdetect: {
      type: DataTypes.ENUM("yes","no"),
      allowNull: true,
    },
    buggymwi: {
      type: DataTypes.ENUM("yes","no"),
      allowNull: true,
    },
    auth: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    fullname: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    trunkname: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    cid_number: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    callingpres: {
      type: DataTypes.ENUM("allowed_not_screened","allowed_passed_screen","allowed_failed_screen","allowed","prohib_not_screened","prohib_passed_screen","prohib_failed_screen","prohib"),
      allowNull: true,
    },
    mohinterpret: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    mohsuggest: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    parkinglot: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    hasvoicemail: {
      type: DataTypes.ENUM("yes","no"),
      allowNull: true,
    },
    subscribemwi: {
      type: DataTypes.ENUM("yes","no"),
      allowNull: true,
    },
    vmexten: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    autoframing: {
      type: DataTypes.ENUM("yes","no"),
      allowNull: true,
    },
    rtpkeepalive: {
      type: DataTypes.INTEGER(11),
      allowNull: true,
    },
    "call-limit": {
      type: DataTypes.INTEGER(11),
      allowNull: true,
    },
    g726nonstandard: {
      type: DataTypes.ENUM("yes","no"),
      allowNull: true,
    },
    ignoresdpversion: {
      type: DataTypes.ENUM("yes","no"),
      allowNull: true,
    },
    allowtransfer: {
      type: DataTypes.ENUM("yes","no"),
      allowNull: true,
    },
    dynamic: {
      type: DataTypes.ENUM("yes","no"),
      allowNull: true,
    },
    device_token: {
      type: DataTypes.STRING,
      allowNull: true,
    }
  });
};
