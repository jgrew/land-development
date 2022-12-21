<script lang="ts">
  import "@esri/calcite-components/dist/components/calcite-modal";
  import "@esri/calcite-components/dist/components/calcite-notice";
  import "@esri/calcite-components/dist/components/calcite-button";
  export let open: boolean = true;

  const handleClick = () => {
    open = !open
  }
</script>

<calcite-modal
  scale="s"
  aria-labelledby="modal-title"
  disable-escape
  disable-outside-close
  disable-close-button
  on:calciteModalClose
  {open}
>
  <h3 id="modal-title" slot="header">About this app</h3>
  <div slot="content">
    <p>
      Welcome to the Orange County Land Development References webapp. The
      webapp’s intended audience is project proponents, and it serves as a
      reference yielding relevant water quality requirements and guidance for
      land development projects, given a particular location.
    </p>
    <calcite-notice active scale="m" width="auto" color="blue" icon>
      <div slot="title">Disclaimer</div>
      <div slot="message">
        This webapp is intended to serve as a reference and may not reflect the
        best available data. The webapp and its contents are provided on an “as
        is”, “as available” basis and may contain errors and/or inaccuracies.
        Project-specific studies should be conducted, and local jurisdiction
        requirements/resources should be consulted. By using this webapp, you
        accept these terms of use.
      </div>
    </calcite-notice>
  </div>
  <!-- svelte-ignore a11y-click-events-have-key-events -->
  <calcite-button
    slot="primary"
    on:click={handleClick}
    width="full"
  >
    Accept
  </calcite-button>
</calcite-modal>
