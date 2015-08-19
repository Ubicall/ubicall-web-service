/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('sipfriends', { 
    id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: ''
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
      defaultValue: 'dynamic'
    },
    type: {
      type: DataTypes.ENUM('FRIEND','USER','PEER'),
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
      type: DataTypes.ENUM('UDP','TCP','UDP,TCP','TCP,UDP'),
      allowNull: true,
    },
    dtmfmode: {
      type: DataTypes.ENUM('RFC2833','INFO','SHORTINFO','INBAND','AUTO'),
      allowNull: true,
    },
    directmedia: {
      type: DataTypes.ENUM('YES','NO','NONAT','UPDATE'),
      allowNull: true,
    },
    nat: {
      type: DataTypes.ENUM('NO','FORCE_RPORT','COMEDIA','FORCE_RPORT,COMEDIA','AUTO_FORCE_RPORT','AUTO_COMEDIA'),
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
      type: DataTypes.ENUM('YES','NO'),
      allowNull: true,
    },
    progressinband: {
      type: DataTypes.ENUM('YES','NO','NEVER'),
      allowNull: true,
    },
    promiscredir: {
      type: DataTypes.ENUM('YES','NO'),
      allowNull: true,
    },
    useclientcode: {
      type: DataTypes.ENUM('YES','NO'),
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
      type: DataTypes.ENUM('YES','NO'),
      allowNull: true,
    },
    busylevel: {
      type: DataTypes.INTEGER(11),
      allowNull: true,
    },
    allowoverlap: {
      type: DataTypes.ENUM('YES','NO'),
      allowNull: true,
    },
    allowsubscribe: {
      type: DataTypes.ENUM('YES','NO'),
      allowNull: true,
    },
    videosupport: {
      type: DataTypes.ENUM('YES','NO'),
      allowNull: true,
    },
    maxcallbitrate: {
      type: DataTypes.INTEGER(11),
      allowNull: true,
    },
    rfc2833compensate: {
      type: DataTypes.ENUM('YES','NO'),
      allowNull: true,
    },
    mailbox: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    session-timers: {
      type: DataTypes.ENUM('ACCEPT','REFUSE','ORIGINATE'),
      allowNull: true,
    },
    session-expires: {
      type: DataTypes.INTEGER(11),
      allowNull: true,
    },
    session-minse: {
      type: DataTypes.INTEGER(11),
      allowNull: true,
    },
    session-refresher: {
      type: DataTypes.ENUM('UAC','UAS'),
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
      type: DataTypes.ENUM('YES','NO'),
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
      type: DataTypes.ENUM('YES','NO'),
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
      type: DataTypes.ENUM('YES','NO'),
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
      type: DataTypes.ENUM('YES','NO'),
      allowNull: true,
    },
    textsupport: {
      type: DataTypes.ENUM('YES','NO'),
      allowNull: true,
    },
    faxdetect: {
      type: DataTypes.ENUM('YES','NO'),
      allowNull: true,
    },
    buggymwi: {
      type: DataTypes.ENUM('YES','NO'),
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
      type: DataTypes.ENUM('ALLOWED_NOT_SCREENED','ALLOWED_PASSED_SCREEN','ALLOWED_FAILED_SCREEN','ALLOWED','PROHIB_NOT_SCREENED','PROHIB_PASSED_SCREEN','PROHIB_FAILED_SCREEN','PROHIB'),
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
      type: DataTypes.ENUM('YES','NO'),
      allowNull: true,
    },
    subscribemwi: {
      type: DataTypes.ENUM('YES','NO'),
      allowNull: true,
    },
    vmexten: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    autoframing: {
      type: DataTypes.ENUM('YES','NO'),
      allowNull: true,
    },
    rtpkeepalive: {
      type: DataTypes.INTEGER(11),
      allowNull: true,
    },
    call-limit: {
      type: DataTypes.INTEGER(11),
      allowNull: true,
    },
    g726nonstandard: {
      type: DataTypes.ENUM('YES','NO'),
      allowNull: true,
    },
    ignoresdpversion: {
      type: DataTypes.ENUM('YES','NO'),
      allowNull: true,
    },
    allowtransfer: {
      type: DataTypes.ENUM('YES','NO'),
      allowNull: true,
    },
    dynamic: {
      type: DataTypes.ENUM('YES','NO'),
      allowNull: true,
    },
    device_token: {
      type: DataTypes.STRING,
      allowNull: true,
    }
  });
};
