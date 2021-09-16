<template>
  <div class="card mb-3">
    <div class="row no-gutters">
      <div class="col-md-4">
        <a href="#">
          <img
            class="img-fit img-left"
            :src="'/properties/' + image"
            alt="..."
          />
        </a>                  
      </div>
      <!--/col-->
      <div class="col-md-8">
        <div class="text-dark card-body">
          <div
            class="text-dark font-weight-bold mb-1 hov_pointer card-title text-truncate h5">
            {{ name }}
          </div>
          <p class="fs-12 text-secondary card-text text-truncate">
            <i class="jsx-1104155267 fal fa-map-marker-alt"></i> {{ location }}
          </p>
          <p class="fs-12 text-secondary card-text text-truncate">
           Genre : {{ genre }}
          </p>
        </div>
        <!--/card-body-->
      </div>
      <!--/col-->
    </div>
    <!--/row-no-gutters-->
  </div>
  <!--/card-->
</template>

<script>
export default {
  props: ["name", "image", "location", "genre" ],
};
</script>

<style>
/* Image left */
.img-left {
  object-fit: cover;
  width: 100%;
  height: 100%;
}
/* Card Label */
.bd-rt {
  border-right: 1px solid #ddd;
  border-radius: 0px;
  margin-right: 0.4em;
}
.fs-12 {
  font-size: 12px;
}
.rate-info small {
  font-weight: 400;
}
.rate-info {
  float: left;
  width: 100%;
  position: absolute;
  bottom: 2;
  left: 1;
  padding: 40px 23px 20px 23px;
  z-index: 2;
}
.rate-info:before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: linear-gradient(
    rgba(255, 255, 255, 0.02),
    rgba(44, 44, 47, 47)
  );
  z-index: -1;
}
.cer span {
  color: #fff;
  text-transform: uppercase;
  font-size: 12px;
  background: rgba(145, 147, 152, 0.7);
  border-radius: 50px;
  padding: 5px 13px;
  float: right;
  /* margin-right: 24px; */
  margin-top: 2px;
}
.img-block {
  position: relative;
  z-index: 1;
  float: left;
  width: 100%;
}
.img-block h5,
.map-box .rate-info > h5 {
  margin: 0px;
  color: #fff;
  font-size: 15px;
  font-weight: 600;
  float: left;
  position: relative;
  top: 14px;
  right: 16px;
}
.card .img-block span,
.map-box .rate-info > span {
  color: #fff;
  text-transform: uppercase;
  font-size: 12px;
  background: rgba(145, 147, 152, 0.7);
  border-radius: 50px;
  padding: 2px 8px;
  float: right;
  margin-top: 2px;
  position: relative;
  left: 18px;
  top: 12px;
}
.card .img-block span.for-sale,
.map-box .rate-info > span.for-sale {
  background: #fc384a;
}
.card .img-block span.for-rent,
.map-box .rate-info > span.for-rent {
  background: #1778f2;
}
@media only screen and (max-width: 1366px) {
  .img-block h5,
  .map-box .rate-info > h5 {
    margin: 0px;
    color: #fff;
    font-size: 15px;
    font-weight: 600;
    float: left;
    position: relative;
    top: 35px;
    right: 16px;
  }
}
</style>
